require('dotenv').config();

const context = require('./context');

/**
 * アプリケーションを初期化するためのクラス
 */
class ApiApplication {
  async init() {
    console.log('#### start init');

    await context.init();

    return this;
  }
}

module.exports = new ApiApplication();
