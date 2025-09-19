/**
 * Game Repository
 */
class GameRepository {
  constructor() {
    this.masterModel = null;
    this.context = null;
  }

  /**
   * Get games based on criteria
   * @param {Object} options
   * @param {number} options.league_id
   * @param {number} options.season_year
   * @param {string} options.season_type
   * @param {Date} options.scheduled_from
   * @param {Date} options.scheduled_to
   * @param {string} options.status_cd
   * @return {Array}
   */
  async getGames(options = {}) {
    const where = {};

    if (options.league_id) where.league_id = options.league_id;
    if (options.season_year) where.season_year = options.season_year;
    if (options.season_type) where.season_type = options.season_type;
    if (options.status_cd) where.status_cd = options.status_cd;

    if (options.scheduled_from || options.scheduled_to) {
      where.scheduled_dt = {};
      if (options.scheduled_from) where.scheduled_dt.gte = options.scheduled_from;
      if (options.scheduled_to) where.scheduled_dt.lte = options.scheduled_to;
    }

    const games = await this.masterModel.findAll({
      where,
      order: [
        ['scheduled_dt', 'ASC'],
      ],
    });

    return games;
  }

  /**
   * Get individual game by ID
   * @param {number} gameId
   * @return {Object|null}
   */
  async getGame(gameId) {
    const game = await this.masterModel.findByPk(gameId);
    return game;
  }

  /**
   * Get game by reference
   * @param {string} gameReference
   * @return {Object|null}
   */
  async getGameByReference(gameReference) {
    const game = await this.masterModel.findOne({
      where: {
        game_reference: gameReference,
      },
    });
    return game;
  }

  /**
   * Upsert individual game
   * @param {Object} gameData
   * @return {Array} [instance, created]
   */
  async upsertGame(gameData) {
    try {
      const [instance, created] = await this.masterModel.upsert(
          {
            game_id: gameData.game_id,
            league_id: gameData.league_id || 1,
            home_team_id: gameData.home_team_id,
            away_team_id: gameData.away_team_id,
            season_year: gameData.season_year,
            season_type: gameData.season_type,
            game_reference: gameData.game_reference,
            game_status: gameData.game_status,
            game_quarter: gameData.game_quarter,
            game_quarter_time_left: gameData.game_quarter_time_left,
            game_title: gameData.game_title,
            scheduled_dt: gameData.scheduled_dt,
            started_dt: gameData.started_dt,
            ended_dt: gameData.ended_dt,
            venue: gameData.venue,
            home_score: gameData.home_score,
            away_score: gameData.away_score,
            winner_team_id: gameData.winner_team_id,
            meta: gameData.meta,
          },
          {
            conflictFields: ['game_id'],
          },
      );

      return {instance, created};
    } catch (error) {
      console.error(`Failed to upsert game:`, error);
      throw error;
    }
  }

  /**
   * Bulk upsert games
   * @param {Array} gamesData
   * @param {number} retryCount
   * @return {Object}
   */
  async bulkUpsertGames(gamesData, retryCount = 3) {
    const results = {
      success: 0,
      updated: 0,
      inserted: 0,
      errors: [],
    };

    for (const gameData of gamesData) {
      let attempt = 0;
      let success = false;

      while (attempt < retryCount && !success) {
        try {
          const result = await this.upsertGame(gameData);

          if (result.created) {
            results.inserted++;
          } else {
            results.updated++;
          }

          results.success++;
          success = true;
        } catch (error) {
          attempt++;
          console.error(
              `Attempt ${attempt} failed for game ${gameData.game_reference}:`,
              error.message,
          );

          if (attempt >= retryCount) {
            results.errors.push({
              game_reference: gameData.game_reference,
              error: error.message,
              attempts: attempt,
            });
          } else {
            // Exponential backoff before retrying
            await this.sleep(Math.pow(2, attempt) * 1000);
          }
        }
      }
    }

    console.log(
        `Games bulk upsert completed: ${results.success} success, ${results.errors.length} errors`,
    );
    return results;
  }

  /**
   * Delete games based on criteria
   * @param {Object} where Deletion criteria
   * @return {number} Number of deleted records
   */
  async deleteGames(where) {
    const deletedCount = await this.masterModel.destroy({
      where,
    });

    return deletedCount;
  }

  /**
   * Sleep processing
   * @param {number} ms Milliseconds
   * @return {Promise} Promise
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * ToDo: DB 接続テストなので消す
   */
  async connectionTest() {
    const count = await this.masterModel.count();
    console.log('count', count);
  }
}

module.exports = GameRepository;
