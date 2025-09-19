const Parser = require('rss-parser');
const { v4: uuidv4 } = require('uuid');
const parser = new Parser();

/**
 * RSS取得クラス
 */
class RssFetcher {
  /**
   * RSSフィードを取得してパースする
   * @param {string} url - RSSフィードのURL
   * @returns {Promise<Object>} パースされたフィードデータ
   */
  async fetchRssFeed(url) {
    try {
      console.log(`RSSフィードを取得中: ${url}`);
      const feed = await parser.parseURL(url);
      console.log(`フィード取得成功: ${feed.title} (${feed.items.length}件の記事)`);
      return feed;
    } catch (error) {
      console.error(`RSSフィード取得エラー (${url}):`, error);
      throw error;
    }
  }

  /**
   * フィードアイテムをDB保存用の形式に変換する
   * @param {Array} items - RSSアイテムの配列
   * @param {string} sourceCd - ソースコード
   * @returns {Array} 変換された記事データの配列
   */
  transformItems(items, sourceCd) {
    return items.map((item) => {
      // 画像URLを抽出（優先順位: enclosure > media:thumbnail）
      let imageUrl = null;
      
      // ライブドアニュース形式: enclosureタグから画像URLを取得
      if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
        imageUrl = item.enclosure.url;
      }
      // 従来形式: media:thumbnailから画像URLを取得
      else if (item['media:thumbnail'] && item['media:thumbnail'].url) {
        imageUrl = item['media:thumbnail'].url;
      }

      return {
        uuid: uuidv4(), // UUIDを生成
        title: item.title || '',
        body: item.contentSnippet || item.content || '',
        url: item.link || '',
        published_at: new Date(item.pubDate || item.isoDate || new Date()),
        image_url: imageUrl,
        source_cd: sourceCd,
        status_cd: 'public',
        tags: null, // タグは後で設定可能
      };
    });
  }

  /**
   * 設定に基づいてRSSを取得する
   * @param {Object} setting - RSS設定
   * @returns {Promise<Array>} 記事データの配列
   */
  async fetchRssBySetting(setting) {
    const feed = await this.fetchRssFeed(setting.setting_val);
    return this.transformItems(feed.items, setting.setting_key);
  }

  /**
   * 複数のRSSフィードを取得する
   * @param {Array} feeds - RSSフィード設定の配列
   * @returns {Promise<Array>} 全記事データの配列
   */
  async fetchMultipleFeeds(feeds) {
    const allArticles = [];

    for (const feed of feeds) {
      try {
        const feedData = await this.fetchRssFeed(feed.url);
        const articles = this.transformItems(feedData.items, feed.source);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`フィード取得エラー (${feed.source}):`, error);
        // エラーが発生しても他のフィードの処理は続行
      }
    }

    return allArticles;
  }
}

module.exports = new RssFetcher();
