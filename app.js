const app = require('./main/app');
const mainSrc = require('./main/index');
const express = require('express');

/**
 * メイン処理
 */
const main = async (event, lambdaContext) => {
  await app.init();
  const batchType = event?.batchType || 'default';

  switch (batchType) {
    case 'rss':
      console.log('Processing RSS data...');
      await mainSrc.kyodo.rssFetcher.main();
      break;
    // RSS取得処理
    case 'standings':
      console.log('Processing basketball standings...');
      await mainSrc.kyodo.getStandings.getStandings();
      break;
    case 'game_schedules':
      console.log('Processing game schedules...');
      await mainSrc.kyodo.getGameSchedules.getGameSchedules();
      break;
    case 'game-details':
      // Kyodo Game Detail API データ取得処理
      await mainSrc.kyodo.getGameDetail.kyodoGameDetailApi();
      break;
    // Kyodo Tournament API データ取得処理
    case 'tournament':
      await mainSrc.kyodo.getTournament.kyodoTournamentApi();
      break;
    case 'player-details':
      // Kyodo Player Detail API データ取得処理
      await mainSrc.kyodo.getPlayerDetail.kyodoPlayerDetailApi();
      break;
    case 'teams':
      // Kyodo Teams API データ取得処理
      await mainSrc.kyodo.getTeams.kyodoTeamsApi();
      break;
    default:
      console.log('Processing default batch...');
      await mainSrc.kyodo.getData.main();
      break;
  }
};

module.exports = {
  main: main,
};
const server = express();

server.use(express.json());

server.get('/start', async (req, res) => {
  try {
    await main(req.body);
    res.status(200).send('Process started successfully');
  } catch (error) {
    res.status(500).send('Error starting process: ' + error.message);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
