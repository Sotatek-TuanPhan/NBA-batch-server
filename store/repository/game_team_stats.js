/**
 * GameTeamStatsリポジトリ
 */
class GameTeamStats {
  /**
   * チーム統計データを保存する
   * @param {Object} gameData - Kyodo APIからのゲームデータ
   * @returns {Promise<void>}
   */
  async saveTeamStatsData(gameData) {
    if (!gameData.statistics) {
      return;
    }

    // ホームチーム統計を保存
    if (gameData.statistics.home) {
      const homeStats = this.mapTeamStats(gameData.game_id, gameData.teams.home.team_id, gameData.statistics.home);
      await this.masterModel.upsert(homeStats, {
        where: {game_id: gameData.game_id, team_id: gameData.teams.home.team_id},
      });
    }

    // アウェイチーム統計を保存
    if (gameData.statistics.away) {
      const awayStats = this.mapTeamStats(gameData.game_id, gameData.teams.away.team_id, gameData.statistics.away);
      await this.masterModel.upsert(awayStats, {
        where: {game_id: gameData.game_id, team_id: gameData.teams.away.team_id},
      });
    }
  }

  /**
   * チーム統計をDBフォーマットにマッピングする
   * @param {number} gameId - ゲームID
   * @param {number} teamId - チームID
   * @param {Object} stats - チーム統計
   * @returns {Object} マッピング済みチーム統計
   */
  mapTeamStats(gameId, teamId, stats) {
    return {
      game_id: gameId,
      team_id: teamId,
      minutes: stats.minutes,
      points: parseInt(stats.points) || null,
      rebounds: parseInt(stats.rebounds) || null,
      assists: parseInt(stats.assists) || null,
      steals: parseInt(stats.steals) || null,
      blocks: parseInt(stats.blocks) || null,
      field_goals_made: parseInt(stats.field_goals_made) || null,
      field_goals_att: parseInt(stats.field_goals_att) || null,
      field_goals_pct: parseFloat(stats.field_goals_pct) || null,
      three_points_made: parseInt(stats.three_points_made) || null,
      three_points_att: parseInt(stats.three_points_att) || null,
      three_points_pct: parseFloat(stats.three_points_pct) || null,
      free_throws_made: parseInt(stats.free_throws_made) || null,
      free_throws_att: parseInt(stats.free_throws_att) || null,
      free_throws_pct: parseFloat(stats.free_throws_pct) || null,
      offensive_rebounds: parseInt(stats.offensive_rebounds) || null,
      defensive_rebounds: parseInt(stats.defensive_rebounds) || null,
      turnovers: parseInt(stats.turnovers) || null,
      points_off_turnovers: parseInt(stats.points_off_turnovers) || null,
      personal_fouls: parseInt(stats.personal_fouls) || null,
      remaining_timeouts: stats.remaining_timeouts || null,
    };
  }
}

module.exports = GameTeamStats;
