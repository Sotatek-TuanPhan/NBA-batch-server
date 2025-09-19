/**
 * GameTimelinesリポジトリ
 */
class GameTimelines {
  /**
   * ゲームタイムラインデータを保存する
   * @param {Object} gameData - Kyodo APIからのゲームデータ
   * @returns {Promise<void>}
   */
  async saveTimelineData(gameData) {
    if (!gameData.timeline || gameData.timeline.length === 0) {
      return;
    }

    // 既存のタイムラインを削除
    await this.masterModel.destroy({
      where: {game_id: gameData.game_id},
    });

    // 新しいタイムラインイベントを挿入
    for (const event of gameData.timeline) {
      try {
        await this.masterModel.create({
          game_id: gameData.game_id,
          sequence: event.sequence,
          quarter: event.quarter,
          clock: event.clock,
          side: event.side || null,
          description: event.description,
          home_score: event.score?.home || null,
          away_score: event.score?.away || null,
        });
      } catch (error) {
        console.error('Timeline event save error:', {
          game_id: gameData.game_id,
          sequence: event.sequence,
          sequenceType: typeof event.sequence,
          sequenceValue: event.sequence,
          error: error.message,
        });
        throw error;
      }
    }
  }
}

module.exports = GameTimelines;
