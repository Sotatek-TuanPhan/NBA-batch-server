/**
 * Tournamentsリポジトリ
 */
class Tournaments {
  /**
   * トーナメント情報を保存/更新する
   * @param {Object} tournamentData - トーナメントデータ
   * @returns {Promise<Object>} 保存されたトーナメント
   */
  async saveTournament(tournamentData) {
    const result = await this.masterModel.upsert(tournamentData, {
      where: {
        name: tournamentData.name,
        season_year: tournamentData.season_year,
        season_type: tournamentData.season_type,
      },
    });

    return result[0];
  }

  /**
   * APIレスポンスからトーナメントデータにマッピング
   * @param {Object} match - APIからのマッチデータ
   * @returns {Object} データベース保存用トーナメントデータ
   */
  mapTournamentData(match) {
    return {
      name: `${match.league} ${match.season_year} ${match.season_type}`,
      league: match.league,
      season_year: match.season_year,
      season_type: match.season_type,
      start_date: null,
      end_date: null,
    };
  }
}

module.exports = Tournaments;
