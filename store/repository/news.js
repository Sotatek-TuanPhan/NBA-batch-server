/**
 * Newsリポジトリ
 */
class News {
  /**
   * ニュース記事を保存する
   * @param {Object} articleData - 記事データ
   * @returns {Promise<Object>} 保存された記事
   */
  async saveArticle(articleData) {
    try {
      // 重複チェック（URLで）
      const existingArticle = await this.masterModel.findOne({
        where: {
          url: articleData.url,
        },
      });

      if (existingArticle) {
        console.log(`記事が既に存在します: ${articleData.title}`);
        return existingArticle;
      }

      // 新しい記事を保存
      const savedArticle = await this.masterModel.create(articleData);
      console.log(`記事を保存しました: ${articleData.title}`);
      return savedArticle;
    } catch (error) {
      console.error('記事保存エラー:', error);
      throw error;
    }
  }

  /**
   * 複数のニュース記事を一括保存する
   * @param {Array} articlesData - 記事データの配列
   * @returns {Promise<Array>} 保存された記事の配列
   */
  async saveArticles(articlesData) {
    const savedArticles = [];

    for (const articleData of articlesData) {
      try {
        const savedArticle = await this.saveArticle(articleData);
        savedArticles.push(savedArticle);
      } catch (error) {
        console.error(`記事保存エラー (${articleData.title}):`, error);
        // エラーが発生しても他の記事の処理は続行
      }
    }

    console.log(`${savedArticles.length}件の記事を処理しました`);
    return savedArticles;
  }

  /**
   * 最新の記事を取得する
   * @param {number} limit - 取得件数
   * @param {string} sourceCd - ソースコード（オプション）
   * @returns {Promise<Array>} 記事の配列
   */
  async getLatestArticles(limit = 10, sourceCd = null) {
    const where = {};
    if (sourceCd) {
      where.source_cd = sourceCd;
    }

    return await this.masterModel.findAll({
      where,
      order: [['published_at', 'DESC']],
      limit: limit,
    });
  }

  /**
   * 統計情報を取得する
   * @returns {Promise<Object>} 統計情報
   */
  async getStats() {
    const totalCount = await this.masterModel.count();
    const sourceStats = await this.masterModel.findAll({
      attributes: [
        'source_cd',
        [this.context.store.sequelizeMaster.fn('COUNT', '*'), 'count'],
      ],
      group: ['source_cd'],
      order: [[this.context.store.sequelizeMaster.fn('COUNT', '*'), 'DESC']],
    });

    return {
      totalCount,
      sourceStats,
    };
  }
}

module.exports = News;
