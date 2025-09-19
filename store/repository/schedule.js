/**
 * Schedule Repository
 */
class ScheduleRepository {
  constructor() {
    this.masterModel = null;
    this.context = null;
  }

  /**
   * Get schedules based on criteria
   * @param {Object} options
   * @param {number} options.league_id
   * @param {Date} options.scheduled_from
   * @param {Date} options.scheduled_to
   * @param {string} options.status
   * @return {Array}
   */
  async getSchedules(options = {}) {
    const where = {};

    if (options.league_id) where.league_id = options.league_id;
    if (options.status) where.status = options.status;

    if (options.scheduled_from || options.scheduled_to) {
      where.scheduled = {};
      if (options.scheduled_from) where.scheduled.gte = options.scheduled_from;
      if (options.scheduled_to) where.scheduled.lte = options.scheduled_to;
    }

    const schedules = await this.masterModel.findAll({
      where,
      order: [
        ['scheduled', 'ASC'],
      ],
    });

    return schedules;
  }

  /**
   * Get individual schedule by game ID
   * @param {number} gameId
   * @return {Object|null}
   */
  async getScheduleByGameId(gameId) {
    const schedule = await this.masterModel.findOne({
      where: {
        game_id: gameId,
      },
    });
    return schedule;
  }

  /**
   * Upsert individual schedule
   * @param {Object} scheduleData
   * @return {Array} [instance, created]
   */
  async upsertSchedule(scheduleData) {
    try {
      const [instance, created] = await this.masterModel.upsert(
          {
            league_id: scheduleData.league_id || 1,
            game_id: scheduleData.game_id,
            scheduled: scheduleData.scheduled,
            status: scheduleData.status,
          },
          {
            conflictFields: ['game_id'],
          },
      );

      return {instance, created};
    } catch (error) {
      console.error(`Failed to upsert schedule:`, error);
      throw error;
    }
  }

  /**
   * Bulk upsert schedules
   * @param {Array} schedulesData
   * @param {number} retryCount
   * @return {Object}
   */
  async bulkUpsertSchedules(schedulesData, retryCount = 3) {
    const results = {
      success: 0,
      updated: 0,
      inserted: 0,
      errors: [],
    };

    for (const scheduleData of schedulesData) {
      let attempt = 0;
      let success = false;

      while (attempt < retryCount && !success) {
        try {
          const result = await this.upsertSchedule(scheduleData);

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
              `Attempt ${attempt} failed for schedule game_id ${scheduleData.game_id}:`,
              error.message,
          );

          if (attempt >= retryCount) {
            results.errors.push({
              game_id: scheduleData.game_id,
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
        `Schedules bulk upsert completed: ${results.success} success, ${results.errors.length} errors`,
    );
    return results;
  }

  /**
   * Delete schedules based on criteria
   * @param {Object} where Deletion criteria
   * @return {number} Number of deleted records
   */
  async deleteSchedules(where) {
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
}

module.exports = ScheduleRepository;
