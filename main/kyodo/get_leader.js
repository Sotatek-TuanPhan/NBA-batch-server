const context = require('../context');
const KyodoApiFetcher = require('./kyodo_api_fetcher');

/**
 * Transform API leader data to match the leaders table schema
 * @param {Object} apiData - The NBA leaders JSON response
 * @return {Object} Single leader record for the leaders table
 */
function transformLeaderData(apiData) {
  console.log('Transforming leader data...');

  if (!apiData || typeof apiData !== 'object') {
    throw new Error('Invalid API response: missing or invalid leader data');
  }

  const transformedLeader = [];
  apiData.length &&
    apiData.forEach((data) => {
      if (!data.leaders || !Array.isArray(data.leaders) || data.leaders.length === 0) {
        throw new Error(`Invalid leader data for category ${data.category}`);
      }

      // Create a separate record for each leader in this category
      data.leaders.forEach((leader) => {
        const playerId = leader.player?.player_id;
        if (!playerId) {
          console.warn(
              `Skipping leader with missing player_id in category ${data.category}:`,
              leader,
          );
          return;
        }

        const obj = {
          leader_id: playerId,
          league_id: 1, // NBA - adjust as needed
          category: data.category,
          category_name: data.category_name,
          category_type: data.category_type,
          season_type: data.season_type,
          src_updated_at: new Date(data.updated),
        };
        transformedLeader.push(obj);
      });
    });

  return transformedLeader;
}

/**
 * Save leader data to database
 * @param {Array} leaderData
 * @return {Object}
 */
async function saveLeaderToDatabase(leaderData) {
  const context = require('../context');

  if (!context?.store?.repository?.Leaders) {
    throw new Error('Leaders repository not available');
  }

  console.log(`Saving ${leaderData.length} leader records to database...`);

  const results = {
    processed: leaderData.length,
    leaders: {
      inserted: 0,
      updated: 0,
      errors: [],
    },
  };

  for (const leader of leaderData) {
    try {
      const leaderResult = await context.store.repository.Leaders.upsertLeader(leader);
      if (leaderResult.created) {
        results.leaders.inserted++;
      } else {
        results.leaders.updated++;
      }
    } catch (error) {
      console.error(`Failed to save leader ${leader.leader_id}:`, error.message);
      results.leaders.errors.push({
        leader_id: leader.leader_id,
        category: leader.category,
        error: error.message,
      });
    }
  }

  console.log(
      `Leaders saved: ${results.leaders.inserted} inserted, ${results.leaders.updated} updated, ${results.leaders.errors.length} errors`,
  );

  return results;
}

/**
 * Main function to get and process leader data
 * @param {Object} options
 * @return {Object}
 */
async function getLeaders(options = {}) {
  try {
    // 1. Fetch from API
    const {data, attempt} = await KyodoApiFetcher.fetchData(
        context.config.kyodo_base_url + '/leaders.json',
    );

    // 2. Transform data - main leader record
    const transformedLeader = transformLeaderData(data);

    // 3. Save to database if context is available
    let dbResults = null;
    if (options.saveToDatabase !== false && transformedLeader.length > 0) {
      dbResults = await saveLeaderToDatabase(transformedLeader);
    }

    // 5. Return results
    const result = {
      success: true,
      processed: transformedLeader.length,
      leaders: {
        inserted: dbResults?.leaders?.inserted || 0,
        updated: dbResults?.leaders?.updated || 0,
        errors: dbResults?.leaders?.errors || [],
      },
      attempt,
      updated_at: new Date().toISOString(),
    };

    console.log(`✅ Leader processing completed on attempt ${attempt}`);
    return result;
  } catch (error) {
    console.error('❌ Failed to process leader data:', error.message);
    throw error;
  }
}

module.exports = {
  getLeaders,
  transformLeaderData,
  saveLeaderToDatabase,
};
