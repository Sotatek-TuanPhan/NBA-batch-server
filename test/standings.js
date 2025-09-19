/**
 * Full test with database operations
 */
async function testStandingsWithDB() {
  try {
    const context = require('../main/context');
    const { getStandings } = require('../main/kyodo/get_standings');

    console.log('Testing full standings process with database...');

    console.log('Initializing context...');
    await context.init();

    // Sync database to create tables
    console.log('Syncing database schema...');
    await context.store.sequelizeMaster.sync({ force: false });
    console.log(' Database schema synced');

    console.log('Testing standings fetch with DB save...');
    const result = await getStandings();

    console.log(' Full test completed successfully:');
    console.log('- Processed records:', result.data.processed);
    console.log('- Inserted records:', result.data.inserted);
    console.log('- Updated records:', result.data.updated);
    console.log('- Errors:', result.data.errors.length);
    console.log('- Season:', result.data.season_year, result.data.season_type);

    if (result.data.errors.length > 0) {
      console.log('Error details:', result.data.errors);
    }
    return result
  } catch (error) {
    console.error(' Full test failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Run tests based on command line argument
if (require.main === module) {
  testStandingsWithDB().finally(() => process.exit(0));
}

module.exports = {
  testStandingsWithDB,
};
