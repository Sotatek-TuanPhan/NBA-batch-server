const {Sequelize, DataTypes} = require('sequelize');
const debug = require('debug')('context');

/**
 * Sequelize を使用した Model 周りの初期化を行うためのクラス
 */
class Store {
  /**
   * initialize Repository
   * @param {Object} context 起動環境の context
   */
  async init(context) {
    this.master = {};

    await this.initSequelize(context.config);
    await this.loadRepository(context);

    return this;
  }

  /**
   * Sequelize の初期化
   * @param {Object} config 起動環境に合わせた設定情報
   */
  async initSequelize(config) {
    debug('Sequelize master database host: %s, username: %s', config.stores.master.host, config.stores.master.username);

    this.sequelizeMaster = await new Sequelize(
        config.stores.master.database,
        config.stores.master.username,
        config.stores.master.password,
        config.stores.master,
    );
    this.DataTypes = DataTypes;
  }

  /**
   * repository のロード
   * @param {Object} context 起動環境の context
   */
  async loadRepository(context) {
    this.repository = require('./repository');
    await this.repository.init(context);
  }
}

module.exports = new Store();
