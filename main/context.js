const path = require('path');

/**
 * コンテキスト
 * @class WebContext
 */
class ApiContext {
  /**
   * Creates an instance of Context
   * @memberof WebContext
   */
  constructor() {
    this.env = process.env.SERVICE_ENV || 'local';
  }

  /**
   * initialize Application
   * @memberof WebContext
   */
  async init() {
    await this.loadConfig();
    await this.loadStore();
  }

  /**
   * 設定ファイル ディレクトリパス
   * @memberof WebContext
   */
  get configDir() {
    return path.join(__dirname, '..', 'config');
  }

  /**
   * 設定ファイル ファイルパス
   * @memberof WebContext
   */
  get configPath() {
    return path.join(this.configDir, `${this.env}.js`);
  }

  /**
   * load setting
   * @memberof WebContext
   */
  async loadConfig() {
    this.config = require(this.configPath);
  }

  /**
   * load store
   */
  async loadStore() {
    this.store = require('../store');
    await this.store.init(this);
  }
}

module.exports = new ApiContext();
