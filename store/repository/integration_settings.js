/**
 * IntegrationSettingsリポジトリ
 */
class IntegrationSettings {
  /**
   * RSS設定を取得する
   * @returns {Promise<Array>} RSS設定の配列
   */
  async getRssSettings() {
    return await this.masterModel.findAll({
      where: {
        setting_type_cd: 'rss',
        status_cd: 'enabled',
      },
    });
  }

  /**
   * 取得対象のRSS設定を取得する
   * @returns {Promise<Array>} 取得対象のRSS設定の配列
   */
  async getFetchableRssSettings() {
    // 指定された構造ではlast_fetched_atがないため、
    // すべてのenabledなRSS設定を取得対象とする
    return await this.getRssSettings();
  }

  /**
   * RSS設定を作成する
   * @param {Object} settingData - 設定データ
   * @returns {Promise<Object>} 作成された設定
   */
  async createRssSetting(settingData) {
    return await this.masterModel.create({
      setting_type_cd: 'rss',
      ...settingData,
    });
  }

  /**
   * RSS設定を更新する
   * @param {number} id - 設定ID
   * @param {Object} settingData - 更新データ
   * @returns {Promise<void>}
   */
  async updateRssSetting(id, settingData) {
    await this.masterModel.update(settingData, {
      where: {
        id: id,
      },
    });
  }

  /**
   * RSS設定を削除する
   * @param {number} id - 設定ID
   * @returns {Promise<void>}
   */
  async deleteRssSetting(id) {
    await this.masterModel.destroy({
      where: {
        id: id,
      },
    });
  }
}

module.exports = IntegrationSettings;
