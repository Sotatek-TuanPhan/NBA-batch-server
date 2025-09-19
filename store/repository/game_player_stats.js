/**
 * GamePlayerStatsリポジトリ
 */
class GamePlayerStats {
  /**
   * プレイヤー統計データを保存する
   * @param {Object} gameData - Kyodo APIからのゲームデータ
   * @returns {Promise<void>}
   */
  async savePlayerStatsData(gameData) {
    if (!gameData.players) {
      return;
    }

    // ホームチームプレイヤー統計を保存
    if (gameData.players.home) {
      for (const player of gameData.players.home) {
        const playerStats = this.mapPlayerStats(gameData.game_id, gameData.teams.home.team_id, player);
        await this.masterModel.upsert(playerStats, {
          where: {game_id: gameData.game_id, player_id: player.player_id},
        });
      }
    }

    // アウェイチームプレイヤー統計を保存
    if (gameData.players.away) {
      for (const player of gameData.players.away) {
        const playerStats = this.mapPlayerStats(gameData.game_id, gameData.teams.away.team_id, player);
        await this.masterModel.upsert(playerStats, {
          where: {game_id: gameData.game_id, player_id: player.player_id},
        });
      }
    }
  }

  /**
   * プレイヤー統計をDBフォーマットにマッピングする
   * @param {number} gameId - ゲームID
   * @param {number} teamId - チームID
   * @param {Object} player - プレイヤーデータ
   * @returns {Object} マッピング済みプレイヤー統計
   */
  mapPlayerStats(gameId, teamId, player) {
    const stats = player.player_statistics;

    return {
      game_id: gameId,
      team_id: teamId,
      player_id: player.player_id,
      active: player.active,
      played: player.played,
      starter: player.starter,
      on_court: player.on_court,
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
      personal_fouls: parseInt(stats.personal_fouls) || null,
      efficiency: parseInt(stats.efficiency) || null,
      pls_min: parseInt(stats.pls_min) || null,
    };
  }
}

module.exports = GamePlayerStats;
