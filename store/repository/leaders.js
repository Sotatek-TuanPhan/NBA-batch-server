/**
 * Leaders Repository
 */
class LeadersRepository {
  constructor() {
    this.masterModel = null;
    this.context = null;
  }

  /**
   * Get leaders based on criteria
   * @param {Object} options
   * @param {number} options.league_id
   * @param {string} options.category
   * @param {string} options.category_type
   * @param {string} options.season_type
   * @param {number} options.leader_id
   * @return {Array}
   */
  async getLeaders(options = {}) {
    const where = {};

    if (options.league_id) where.league_id = options.league_id;
    if (options.category) where.category = options.category;
    if (options.category_type) where.category_type = options.category_type;
    if (options.season_type) where.season_type = options.season_type;
    if (options.leader_id) where.leader_id = options.leader_id;

    const leaders = await this.masterModel.findAll({
      where,
      order: [
        ['id', 'ASC'],
      ],
    });

    return leaders;
  }

  /**
   * Get individual leader by ID
   * @param {number} leaderId
   * @return {Object|null}
   */
  async getLeader(leaderId) {
    const leader = await this.masterModel.findByPk(leaderId);
    return leader;
  }

  /**
   * Upsert individual leader
   * @param {Object} leaderData
   * @return {Array} [instance, created]
   */
  async upsertLeader(leaderData) {
    try {
      const [instance, created] = await this.masterModel.upsert(
          {
            league_id: leaderData.league_id || 1,
            leader_id: leaderData.leader_id,
            category: leaderData.category,
            category_name: leaderData.category_name,
            category_type: leaderData.category_type,
            season_type: leaderData.season_type,
            src_updated_at: leaderData.src_updated_at,
          },
          {
            conflictFields: ['league_id', 'category', 'category_type', 'season_type'],
          },
      );

      return {instance, created};
    } catch (error) {
      console.error(`Failed to upsert leader:`, error);
      throw error;
    }
  }

  /**
   * Bulk upsert leaders
   * @param {Array} leadersData
   * @param {number} retryCount
   * @return {Object}
   */
  async bulkUpsertLeaders(leadersData, retryCount = 3) {
    const results = {
      success: 0,
      updated: 0,
      inserted: 0,
      errors: [],
    };

    for (const leaderData of leadersData) {
      let attempt = 0;
      let success = false;

      while (attempt < retryCount && !success) {
        try {
          const result = await this.upsertLeader(leaderData);

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
              `Attempt ${attempt} failed for leader ${leaderData.leader_id} - ${leaderData.category}:`,
              error.message,
          );

          if (attempt >= retryCount) {
            results.errors.push({
              leader_id: leaderData.leader_id,
              category: leaderData.category,
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
        `Leaders bulk upsert completed: ${results.success} success, ${results.errors.length} errors`,
    );
    return results;
  }

  /**
   * Delete leaders based on criteria
   * @param {Object} where Deletion criteria
   * @return {number} Number of deleted records
   */
  async deleteLeaders(where) {
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

module.exports = LeadersRepository;
