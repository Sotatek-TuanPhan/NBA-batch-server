const context = require('../context');

/**
 * Kyodo Player Detail API データ取得処理
 */
const kyodoPlayerDetailApi = async () => {
  try {
    console.log('=== Kyodo Player Detail API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // テスト用URL（後で設定から取得するように変更可能）
    const testUrl = context.config.kyodo_base_url + '/player_499.json';

    try {
      console.log(`プレイヤーデータ取得開始: ${testUrl}`);

      // Kyodo APIからデータを取得
      const {data: playerData} = await kyodoApiFetcher.fetchData(testUrl);
      console.log(`プレイヤーデータ取得完了: Player ID ${playerData.player_id}`);

      // プレイヤーリポジトリを使用してデータを保存
      await context.store.repository.Player.savePlayerDetailData(playerData);

      console.log('プレイヤーデータ保存完了');
      console.log(`プレイヤー処理完了: ${playerData.player_id}`);
    } catch (error) {
      console.error(`プレイヤー処理エラー: ${error}`);
      // エラーが発生しても処理は続行可能
    }

    console.log('=== Kyodo Player Detail API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Player Detail API データ取得処理エラー:', error);
    throw error;
  }
};

module.exports = {
  kyodoPlayerDetailApi,
};
