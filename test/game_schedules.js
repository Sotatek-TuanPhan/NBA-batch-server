/**
 * Full test with database operations
 */
async function testGameSchedulesWithDB() {
  const context = require('../main/context');
  const { getGameSchedules } = require('../main/kyodo/get_game_schedules');

  try {
    console.log('Testing full game schedules process with database...');

    console.log('Initializing context...');
    await context.init();

    // Sync database to create tables
    console.log('Syncing database schema...');
    await context.store.sequelizeMaster.sync({ force: false });
    console.log('Database schema synced');

    console.log('Testing game schedules fetch with DB save...');
    const result = await getGameSchedules();

    console.log('✅ Full test completed successfully:');
    console.log(`- Processed records: ${result.processed}`);
    console.log(`- Inserted records games: ${result.games.inserted}`);
    console.log(`- Updated records games: ${result.games.updated}`);
    console.log(`- Errors games: ${result.games.errors?.length || 0}`);
    console.log(`- Inserted records schedules: ${result.schedules.inserted}`);
    console.log(`- Updated records schedules: ${result.schedules.updated}`);
    console.log(`- Errors schedules: ${result.schedules.errors?.length || 0}`);

    if (result.errors?.length > 0) {
      console.log('Error details:', result.errors);
    }
    return result;
  } catch (error) {
    console.error('❌ Full test failed:', error);
  } finally {
    // Clean up context
    if (context?.store?.sequelizeMaster) {
      await context.store.sequelizeMaster.close();
    }
  }
}

// Run tests based on command line argument
if (require.main === module) {
  testGameSchedulesWithDB().finally(() => process.exit(0));
}

module.exports = {
  testGameSchedulesWithDB,
};
