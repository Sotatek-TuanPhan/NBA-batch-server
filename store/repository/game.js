/**
 * Gameリポジトリ
 */
class Game {
  /**
   * ゲーム情報を保存/更新する
   * @param {Object} gameData - Kyodo APIからのゲームデータ
   * @returns {Promise<Object>} 保存されたゲーム
   */
  async saveGameData(gameData) {
    // リーグIDを取得または作成
    const leagueId = await this.context.store.repository.League.findOrCreateLeague(gameData.league);

    const gameUpdateData = {
      game_id: gameData.game_id,
      league_id: leagueId,
      season_year: gameData.season_year,
      season_type: gameData.season_type,
      game_reference: gameData.game_reference,
      game_status: gameData.game_status,
      game_quarter: gameData.game_quarter,
      game_quarter_time_left: gameData.game_quarter_time_left,
      game_title: gameData.game_title,
      scheduled_dt: new Date(gameData.scheduled.dt),
      home_score: gameData.game_score?.home || null,
      away_score: gameData.game_score?.away || null,
      winner_team_id: this.getWinnerTeamId(gameData),
      venue: gameData.venue,
      home_team_id: gameData.teams?.home?.team_id || null,
      away_team_id: gameData.teams?.away?.team_id || null,
      meta: {
        scheduled: gameData.scheduled,
        teams: gameData.teams,
      },
    };

    const result = await this.masterModel.upsert(gameUpdateData, {
      where: {game_id: gameData.game_id},
    });

    return result[0];
  }

  /**
   * 勝者チームIDを決定する
   * @param {Object} gameData - ゲームデータ
   * @returns {number|null} 勝者チームID
   */
  getWinnerTeamId(gameData) {
    if (!gameData.game_score || !gameData.game_score.winner_side || !gameData.teams) {
      return null;
    }

    const winnerSide = gameData.game_score.winner_side;
    if (winnerSide === 'home') {
      return gameData.teams.home?.team_id || null;
    } else if (winnerSide === 'away') {
      return gameData.teams.away?.team_id || null;
    }

    return null;
  }
}

module.exports = Game;
