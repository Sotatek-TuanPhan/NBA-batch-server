/**
 * Leagueリポジトリ
 */
class League {
  /**
   * リーグを名前で検索し、存在しない場合は作成する
   * @param {string} leagueName - リーグ名
   * @returns {Promise<number>} リーグID
   */
  async findOrCreateLeague(leagueName) {
    if (!leagueName) {
      throw new Error('League name is required');
    }

    const [league, created] = await this.masterModel.findOrCreate({
      where: { name: leagueName },
      defaults: { name: leagueName },
    });

    if (created) {
      console.log(`🏆 New league created: ${leagueName} (ID: ${league.id})`);
    }

    return league.id;
  }

   /**
   * Get league by name
   * @param {string} leagueName - League name
   * @returns {Promise<Object>} League
   */
   async getLeagueByName(leagueName) {
    return await this.masterModel.findOne({
      where: {
        name: leagueName,
      },
    });
  }

  /**
   * Get all leagues
   * @returns {Promise<Array>} Array of leagues
   */
  async getAllLeagues() {
    return await this.masterModel.findAll({
      order: [['name', 'ASC']],
    });
  }
}

module.exports = League;
