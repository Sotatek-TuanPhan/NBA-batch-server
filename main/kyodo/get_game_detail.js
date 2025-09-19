const context = require('../context');

/**
 * Kyodo Game Detail API データ取得処理
 */
const kyodoGameDetailApi = async () => {
  try {
    console.log('=== Kyodo Game Detail API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // 現在時刻から1時間の範囲を取得 (1時間前 ～ 1時間後)
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
    const oneHourLater = new Date(now.getTime() + (60 * 60 * 1000));

    console.log(`スケジュール検索範囲: ${oneHourAgo.toISOString()} - ${oneHourLater.toISOString()}`);

    try {
      // スケジュールリポジトリから1時間範囲のゲームを取得（クローズまたはキャンセル以外）
      const schedules = await context.store.repository.Schedule.getSchedules({
        scheduled_from: oneHourAgo,
        scheduled_to: oneHourLater,
      });

      // ステータスがclosedまたはcancelledでないゲームをフィルタリング
      const activeGames = schedules.filter((schedule) => {
        const status = schedule.status ? schedule.status.toLowerCase() : '';
        return status !== 'closed' && status !== 'cancelled' && status !== 'postponed';
      });

      console.log(`1時間範囲内のアクティブなゲーム: ${activeGames.length}件`);

      if (activeGames.length === 0) {
        console.log('処理対象のゲームがありません');
        return;
      }

      // 各ゲームの詳細データを取得・保存
      let totalGamesProcessed = 0;
      let totalGamesErrors = 0;

      for (const schedule of activeGames) {
        try {
          const gameUrl = `${context.config.kyodo_base_url}/game_${schedule.game_id}.json`;
          console.log(`ゲームデータ取得開始: ${gameUrl}`);

          // Kyodo APIからデータを取得
          const {data: gameData} = await kyodoApiFetcher.fetchData(gameUrl);
          console.log(`ゲームデータ取得完了: Game ID ${gameData.game_id}`);

          // 各リポジトリを使用してデータを保存
          await context.store.repository.Game.saveGameData(gameData);
          await context.store.repository.GameQuarter.saveQuartersData(gameData);
          await context.store.repository.GameTeamStats.saveTeamStatsData(gameData);
          await context.store.repository.GamePlayerStats.savePlayerStatsData(gameData);
          await context.store.repository.GameTimelines.saveTimelineData(gameData);

          console.log(`ゲーム処理完了: ${gameData.game_id}`);
          totalGamesProcessed++;
        } catch (error) {
          console.error(`ゲーム処理エラー (Game ID: ${schedule.game_id}):`, error);
          totalGamesErrors++;
          // エラーが発生しても他のゲームの処理は続行
        }
      }

      console.log('ゲームデータ保存完了');
      console.log(`処理完了: ${totalGamesProcessed}ゲーム成功, ${totalGamesErrors}ゲームエラー`);
    } catch (error) {
      console.error(`ゲーム処理エラー: ${error}`);
      // エラーが発生しても処理は続行可能
    }

    console.log('=== Kyodo Game Detail API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Game Detail API データ取得処理エラー:', error);
    throw error;
  }
};

module.exports = {
  kyodoGameDetailApi,
};
