const isFunction = require('mout/lang/isFunction');
const sinon = require('sinon');
const SequelizeMocking = require('sequelize-mocking').SequelizeMocking;
const sequelizeFixtures = require('sequelize-fixtures');
const {Sequelize, DataTypes} = require('sequelize');

const webContext = require('../main/context');
const webApp = require('../main/app');
const fixtures = require('./fixtures');

const sandbox = sinon.createSandbox();
const sequelize = new Sequelize({dialect: 'sqlite'});

let mockStoreMain;
const modifiedModels = {};

/**
 * Model を初期化する
 * @param {Object} modelsPath
 */
const initSequelizeModels = () => {
  webContext['store'] = {
    sequelizeMaster: sequelize,
    repository: require('../store/repository'),
  };

  webContext.store.repository.init(webContext);

  const models = {
    Game: 'game',
    GameQuarter: 'game_quarter',
    GameTimelines: 'game_timelines',
    GamePlayerStats: 'game_player_stats',
    GameTeamStats: 'game_team_stats',
    News: 'news',
    IntegrationSettings: 'integration_settings',
    Tournaments: 'tournaments',
    TournamentMatches: 'tournament_matches',
    Player: 'player',
    Teams: 'teams',
    League: 'league',
  };

  const setModifiedModel = (modelName) => {
    return () => {
      modifiedModels[models[modelName]] = true;
    };
  };

  const importedModels = {};
  Object.keys(models).forEach((modelName) => {
    try {
      const model = require(`../store/mysql/${models[modelName]}`);

      importedModels[modelName] = {
        masterModel: model(webContext.store.sequelizeMaster, DataTypes),
      };
    } catch (error) {
      console.error(`Error loading model ${modelName}:`, error);
    }
  });

  for (const modelName in webContext.store.repository) {
    if (webContext.store.repository.hasOwnProperty(modelName)) {
      const model = importedModels[modelName].masterModel;
      // 変更を検知できるようにhookを仕込む
      model.addHook('afterCreate', setModifiedModel(modelName));
      model.addHook('afterDestroy', setModifiedModel(modelName));
      model.addHook('afterUpdate', setModifiedModel(modelName));
      model.addHook('afterSave', setModifiedModel(modelName));
      model.addHook('afterUpsert', setModifiedModel(modelName));
      model.addHook('afterBulkCreate', setModifiedModel(modelName));
      model.addHook('afterBulkDestroy', setModifiedModel(modelName));
      model.addHook('afterBulkUpdate', setModifiedModel(modelName));
      if (isFunction(model.associate)) {
        // model.associate(importedModels);
      }
    }
  }
};

/**
 * Mock を作成する
 * @return {Promise<void>}
 */
const applyMock = async () => {
  // 先にモデルを定義してからMockingを作成
  const models = {
    Game: 'game',
    News: 'news',
    IntegrationSettings: 'integration_settings',
    Teams: 'teams',
    Player: 'player',
  };

  // モデルをSequelizeに登録
  Object.keys(models).forEach((modelName) => {
    try {
      const model = require(`../store/mysql/${models[modelName]}`);
      model(sequelize, DataTypes);
    } catch (error) {
      console.warn(`Failed to load model ${modelName}:`, error.message);
    }
  });

  mockStoreMain = await SequelizeMocking.create(sequelize, {logging: false});

  // loadStoreを無視させる
  sandbox.stub(webContext, 'loadStore').resolves();
};

/**
 * Fixture からデータを生成する
 * @return {Promise<void>}
 */
const loadFixtures = async () => {
  const models = SequelizeMocking.mapModels(mockStoreMain);
  await sequelize.query('PRAGMA foreign_keys = OFF', {logging: false});

  // fixture を読み込み
  const task = fixtures.map((fixture) => {
    try {
      return sequelizeFixtures.loadFixture(fixture, models, {log: () => {}});
    } catch (error) {
      console.warn(`Failed to load fixture:`, error.message);
      return Promise.resolve();
    }
  });
  await Promise.all(task);
  await sequelize.query('PRAGMA foreign_keys = ON', {logging: false});

  // fixture をセット
  mockStoreMain.modelManager.all.forEach((model) => {
    const originalModel = sequelize.models[model.name];
    if (typeof originalModel === 'function') {
      model.associations = originalModel.associations;
    }
  });
};

initSequelizeModels();

before(async function() {
  await applyMock();
  await webApp.init();
  await loadFixtures();
});
