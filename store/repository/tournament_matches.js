/**
 * TournamentMatchesリポジトリ
 */
class TournamentMatches {
  /**
   * トーナメントマッチ情報を保存/更新する
   * @param {Object} matchData - マッチデータ
   * @returns {Promise<Object>} 保存されたマッチ
   */
  async saveMatch(matchData) {
    const result = await this.masterModel.upsert(matchData, {
      where: {
        tournament_id: matchData.tournament_id,
        round: matchData.round,
        bracket_number: matchData.bracket_number,
      },
    });

    return result[0];
  }

  /**
   * APIレスポンスからマッチデータにマッピング
   * @param {number} tournamentId - トーナメントID
   * @param {Object} match - APIからのマッチデータ
   * @returns {Object} データベース保存用マッチデータ
   */
  mapMatchData(tournamentId, match) {
    return {
      tournament_id: tournamentId,
      round: match.round,
      round_name: match.round_name,
      bracket_number: match.bracket_number,
      home_team_id: match.teams.home.team_id,
      home_seed: match.teams.home.seed || null,
      home_score: match.record?.home || null,
      away_team_id: match.teams.away.team_id,
      away_seed: match.teams.away.seed || null,
      away_score: match.record?.away || null,
      winner_side: match.record?.winner_side || null,
    };
  }
}

module.exports = TournamentMatches;
