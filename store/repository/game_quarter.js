/**
 * GameQuarterリポジトリ
 */
class GameQuarter {
  /**
   * ゲームクォーターデータを保存する
   * @param {Object} gameData - Kyodo APIからのゲームデータ
   * @returns {Promise<void>}
   */
  async saveQuartersData(gameData) {
    if (!gameData.game_score || !gameData.game_score.linescore) {
      return;
    }

    const linescore = gameData.game_score.linescore;

    for (const quarterData of Object.values(linescore)) {
      await this.masterModel.upsert({
        game_id: gameData.game_id,
        quarter: quarterData.quarter,
        home_score: quarterData.home,
        away_score: quarterData.away,
      }, {
        where: {
          game_id: gameData.game_id,
          quarter: quarterData.quarter,
        },
      });
    }
  }
}

module.exports = GameQuarter;
