const context = require('../context');
const kyodoApiFetch = require('./kyodo_api_fetcher');

async function getStandings() {
  const {data, attempt} = await kyodoApiFetch.fetchData(context.config.kyodo_base_url + '/standings.json');

  const result = await saveStandingsToDatabase(data);

  console.log('Standings processing completed successfully:', result);
  return {
    success: true,
    data: result,
    attempt: attempt,
  };
}

/**
 * Save decoded standings data to the database
 * @param {Object} standingsData
 * @return {Promise<Object>}
 */
async function saveStandingsToDatabase(standingsData) {
  try {
    if (!context.store) {
      await context.init();
    }

    const standingsRepository = context.store.repository.Standings;

    if (!standingsRepository) {
      throw new Error('Standings repository is not initialized');
    }

    const mappedStandings = standingsData
        .map((data, index) =>
          data.standings.map((standing) => ({
            team_id: standing.team?.team_id,
            season_year: standingsData[index].season_year,
            season_type: standingsData[index].season_type,
            conference: standing.conference,
            conference_rank: standing.conference_rank,
            conference_tiebreak: standing.conference_tiebreak,
            conference_games_behind: standing.conference_games_behind,
            division: standing.division,
            division_rank: standing.division_rank,
            division_tiebreak: standing.division_tiebreak,
            division_games_behind: standing.division_games_behind,
            inprogress: standing.inprogress,
            records: standing.records,
            updated: standingsData.updated,
          })),
        )
        .flat();

    const validStandings = mappedStandings.filter((standing) => {
      if (!standing.team_id) {
        console.warn('Skipping standing with missing team_id:', standing);
        return false;
      }
      return true;
    });

    if (validStandings.length === 0) {
      throw new Error('No valid standings data found after mapping');
    }

    console.log(`Processing ${validStandings.length} valid standings records`);

    const result = await standingsRepository.bulkUpsertStandings(validStandings);

    return {
      processed: validStandings.length,
      success: result.success,
      inserted: result.inserted,
      updated: result.updated,
      errors: result.errors,
      season_year: [...new Set(standingsData.map((data) => data.season_year))].join(', '),
      season_type: [...new Set(standingsData.map((data) => data.season_type))].join(', '),
      updated_at: standingsData.updated,
    };
  } catch (error) {
    console.error('Database save error:', error);
    throw new Error(`Failed to save standings to database: ${error.message}`);
  }
}

module.exports = {
  getStandings,
  saveStandingsToDatabase,
};
