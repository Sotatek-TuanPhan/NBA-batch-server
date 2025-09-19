const app = require('./main/app');
const mainSrc = require('./main/index');

/**
 * メイン処理
 */
const main = async (event) => {
  await app.init();

  // RSS取得処理
  await mainSrc.kyodo.getData.main();

  // Kyodo Game Detail API データ取得処理
  await mainSrc.kyodo.getData.kyodoGameDetailApi();

  // Kyodo Tournament API データ取得処理
  await mainSrc.kyodo.getData.kyodoTournamentApi();

  // Kyodo Player Detail API データ取得処理
  await mainSrc.kyodo.getData.kyodoPlayerDetailApi();

  // Kyodo Teams API データ取得処理
  await mainSrc.kyodo.getData.kyodoTeamsApi();
};

module.exports = {
  main: main,
};
