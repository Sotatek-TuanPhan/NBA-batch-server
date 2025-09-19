const context = require('#context');

/**
 * メイン処理
 */
const main = async () => {
  try {
    console.log('=== RSS取得処理開始 ===');

    // 取得対象のRSS設定を取得
    const fetchableSettings =
      await context.store.repository.IntegrationSettings.getFetchableRssSettings();
    console.log(`${fetchableSettings.length}件のRSS設定が取得対象です`);

    if (fetchableSettings.length === 0) {
      console.log('取得対象のRSS設定がありません');
      return;
    }

    const rssFetcher = require('./rss_fetcher');
    let totalProcessed = 0;

    // 各RSS設定に対して処理を実行
    for (const setting of fetchableSettings) {
      try {
        console.log(`RSS取得開始: ${setting.setting_key} (${setting.setting_val})`);

        // RSSを取得
        const articles = await rssFetcher.fetchRssBySetting(setting);
        console.log(`${articles.length}件の記事を取得しました`);

        // DBに保存
        if (articles.length > 0) {
          const savedArticles = await context.store.repository.News.saveArticles(articles);
          console.log(`${savedArticles.length}件の記事を保存しました`);
          totalProcessed += savedArticles.length;
        }

        console.log(`RSS取得完了: ${setting.setting_key}`);
      } catch (error) {
        console.error(`RSS取得エラー (${setting.setting_key}):`, error);
        // エラーが発生しても他の設定の処理は続行
      }
    }

    // 統計情報を表示
    const stats = await context.store.repository.News.getStats();
    console.log('=== 統計情報 ===');
    console.log(`総記事数: ${stats.totalCount}件`);
    console.log(`今回処理件数: ${totalProcessed}件`);
    console.log('ソース別統計:');
    stats.sourceStats.forEach((stat) => {
      console.log(`  ${stat.source_cd}: ${stat.dataValues.count}件`);
    });

    console.log('=== RSS取得処理完了 ===');
  } catch (error) {
    console.error('RSS取得処理エラー:', error);
    throw error;
  }
};

module.exports = {
  main: main,
};
