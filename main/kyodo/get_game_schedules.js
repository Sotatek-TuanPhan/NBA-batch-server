const context = require('../context');
const KyodoApiFetcher = require('./kyodo_api_fetcher');

/**
 * Transform API data to match the expected format
 * @param {Object} apiData
 * @return {Array}
 */
function transformGameScheduleData(apiData) {
  console.log('Transforming game schedule data...');

  if (!Array.isArray(apiData)) {
    throw new Error('Invalid API response: missing games array');
  }
  const transformedGames = apiData.map((game) => {
    // Calculate scheduled date
    const scheduledDate = new Date(game.scheduled.dt);

    return {
      // Basic identifiers
      game_id: game.game_id,
      league_id: game?.league_id ?? (game.league === 'NBA' ? 1 : 2),
      season_year: game.season_year,
      season_type: game.season_type,
      game_reference: game.game_reference,

      // Team information
      teams: {
        home: {
          team_id: game.teams?.home?.team_id,
          team_name: game.teams?.home?.name,
        },
        away: {
          team_id: game.teams?.away?.team_id,
          team_name: game.teams?.away?.name,
        },
      },

      // Game status and timing
      game_status: game.game_status,
      game_quarter: game.game_quarter,
      game_quarter_time_left: game.game_quarter_time_left,
      game_title: game.game_title,
      scheduled_dt: game.scheduled.dt,
      // Schedule information
      scheduled: {
        dt: scheduledDate,
        date: scheduledDate.toISOString().split('T')[0],
        time: scheduledDate.toTimeString().split(' ')[0],
      },

      // Venue information
      venue: game.venue ?? null,

      // Score information
      game_score: game.game_score ?? {
        home: game.home_points || 0,
        away: game.away_points || 0,
        winner_side:
          game.home_points && game.away_points ?
            game.home_points > game.away_points ?
              'home' :
              'away' :
            null,
      },

      // Additional metadata
      series_number: game.series_number,
      sr_id: game.sr_id,
    };
  });

  console.log(` Transformed ${transformedGames.length} game schedules`);
  return transformedGames;
}

/**
 * Save game schedules to database (both games and schedules tables)
 * @param {Array} gameSchedules
 * @return {Object}
 */
async function saveGameSchedulesToDatabase(gameSchedules) {
  const context = require('../context');

  if (!context?.store?.repository?.Game || !context?.store?.repository?.Schedule) {
    throw new Error('Game or Schedule repository not available');
  }

  console.log(`Saving ${gameSchedules.length} game schedules to database...`);

  const results = {
    processed: gameSchedules.length,
    games: {
      inserted: 0,
      updated: 0,
      errors: [],
    },
    schedules: {
      inserted: 0,
      updated: 0,
      errors: [],
    },
  };
  for (const gameData of gameSchedules) {
    try {
      // 1. Save to GAMES table
      const dbGameData = {
        game_id: gameData.game_id,
        league_id: gameData.league_id,
        home_team_id: gameData.teams.home.team_id,
        away_team_id: gameData.teams.away.team_id,
        season_year: gameData.season_year,
        season_type: gameData.season_type,
        game_reference: gameData.game_reference,
        game_status: gameData.game_status,
        game_quarter: gameData.game_quarter,
        game_quarter_time_left: gameData.game_quarter_time_left,
        game_title: gameData.game_title,
        scheduled_dt: gameData.scheduled.dt,
        venue: gameData.venue, // Store as JSON
        home_score: gameData.game_score?.home || 0,
        away_score: gameData.game_score?.away || 0,
        winner_team_id:
          gameData.game_score?.winner_side === 'home' ?
            gameData.teams.home.team_id :
            gameData.game_score?.winner_side === 'away' ?
            gameData.teams.away.team_id :
            null,
        meta: null,
      };

      const gameResult = await context.store.repository.Game.upsertGame(dbGameData);
      if (gameResult.created) {
        results.games.inserted++;
      } else {
        results.games.updated++;
      }

      // 2. Save to SCHEDULES table
      const scheduleData = {
        league_id: gameData.league_id,
        game_id: gameData.game_id,
        scheduled: gameData.scheduled.dt,
        status: gameData.game_status,
      };

      const scheduleResult = await context.store.repository.Schedule.upsertSchedule(scheduleData);
      if (scheduleResult.created) {
        results.schedules.inserted++;
      } else {
        results.schedules.updated++;
      }
    } catch (error) {
      console.error(`Failed to save game ${gameData.game_id}:`, error.message);
      results.games.errors.push({
        game_id: gameData.game_id,
        error: error.message,
      });
      results.schedules.errors.push({
        game_id: gameData.game_id,
        error: error.message,
      });
    }
  }

  console.log(
      `Games saved: ${results.games.inserted} inserted, ${results.games.updated} updated, ${results.games.errors.length} errors`,
  );
  console.log(
      `Schedules saved: ${results.schedules.inserted} inserted, ${results.schedules.updated} updated, ${results.schedules.errors.length} errors`,
  );

  return results;
}

/**
 * Main function to get and process game schedules
 * @param {Object} options
 * @return {Object}
 */
async function getGameSchedules(options = {}) {
  // 1. Fetch from API
  const {data, attempt} = await KyodoApiFetcher.fetchData(
      context.config.kyodo_base_url + '/schedule.json',
  );

  // 2. Transform data
  const transformedData = transformGameScheduleData(data);

  // 3. Save to database if context is available
  let dbResults = null;
  if (options.saveToDatabase !== false) {
    dbResults = await saveGameSchedulesToDatabase(transformedData);
  }

  // 4. Return results
  const result = {
    success: true,
    processed: transformedData.length,
    games: {
      inserted: dbResults?.games?.inserted || 0,
      updated: dbResults?.games?.updated || 0,
      errors: dbResults?.games?.errors || [],
    },
    schedules: {
      inserted: dbResults?.schedules?.inserted || 0,
      updated: dbResults?.schedules?.updated || 0,
      errors: dbResults?.schedules?.errors || [],
    },
    data: transformedData,
    attempt,
    updated_at: new Date().toISOString(),
  };

  console.log(`✅ Game schedules processing completed on attempt ${attempt}`);
  return result;
}

module.exports = {
  getGameSchedules,
  transformGameScheduleData,
  saveGameSchedulesToDatabase,
};
