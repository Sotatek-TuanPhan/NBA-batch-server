
/**
 * Full test with database operations
 * This would normally call the API, but we'll mock it for testing
 */
async function testLeadersWithDB() {
  const context = require('../main/context');
  const { getLeaders } = require('../main/kyodo/get_leader');
  try {
    console.log('Testing full game schedules process with database...');

    console.log('Initializing context...');
    await context.init();

    // Sync database to create tables
    console.log('Syncing database schema...');
    await context.store.sequelizeMaster.sync({ force: false });
    console.log('Database schema synced');

    console.log('Testing leaders fetch with DB save...');
    const result = await getLeaders();

    console.log('✅ Full test completed successfully:');
    console.log(`- Processed records: ${result.processed}`);
    console.log(`- Inserted records leaders: ${result.leaders.inserted}`);
    console.log(`- Updated records leaders: ${result.leaders.updated}`);
    console.log(`- Errors leaders: ${result.leaders.errors?.length || 0}`);

    if (result.errors?.length > 0) {
      console.log('Error details:', result.errors);
    }
    return result;
  } catch (error) {
    console.error('❌ Full test failed:', error);
  } 
}

// Run tests based on command line argument
if (require.main === module) {
  testLeadersWithDB().finally(() => process.exit(0));
}

module.exports = {
  testLeadersWithDB,
};
