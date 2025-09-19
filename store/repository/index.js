const isFunction = require('mout/lang/isFunction');
const {DataTypes} = require('sequelize');

/**
 * store 情報を利用して、モデルクラスを読み込む
 */
class Repository {
  /**
   * repository の初期化
   * @param {Object} context 起動環境の context
   */
  async init(context) {
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
      TeamStats: 'team_stats',
      TeamMatchResults: 'team_match_results',
      League: 'league',
      Standings: 'standings',
      Schedule: 'schedule',
    };

    await this.setupModel(models, context.store.repository, context.store.sequelizeMaster);

    // 各リポジトリにcontextを設定
    for (const key in models) {
      if (this[key] && typeof this[key] === 'object') {
        this[key].context = context;
      }
    }
  }

  /**
   * Model Object をセットアップする
   * @param {Object} models
   * @param {Object} repository
   * @param {Object} sequelizeMaster
   * @param {Object} version
   */
  async setupModel(models, repository, sequelizeMaster, version) {
    for (const key in models) {
      if (!Object.prototype.hasOwnProperty.call(models, key)) {
        continue;
      }

      const RepositoryClass = require(`./${models[key]}`);
      this[key] = new RepositoryClass();
      this[key].masterModel = require(`../mysql/${models[key]}`)(sequelizeMaster, DataTypes, version);
    }

    for (const key in models) {
      if (!Object.prototype.hasOwnProperty.call(models, key)) {
        continue;
      }
      if (!isFunction(this[key].masterModel.associate)) {
        continue;
      }

      const relations = this[key].masterModel.associate(repository);
      relations.map((relation) => {
        this[key][relation.constructor.name] = relation;
      });
    }
  }

  /**
   * API 出力用に各モデルへの振り分けを行う
   * @param {Object} record Sequelize から返却された DB Record data
   * @param {Object} options 出力オプション
   * @return {Object} 整形後のデータ
   */
  apiOutput(record, options) {
    const models = {
    };

    if (models[record.constructor.name]) {
      return models[record.constructor.name].apiOutput(record, options);
    }
    return record;
  }
}

module.exports = new Repository();
