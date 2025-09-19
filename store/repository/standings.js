/**
 * Standings Repository
 */
class StandingsRepository {
  constructor() {
    this.masterModel = null;
    this.context = null;
  }

  /**
   * Get standings data based on criteria
   * @param {Object} options
   * @param {number} options.league_id
   * @param {number} options.season_year
   * @param {string} options.season_type
   * @param {string} options.conference
   * @param {string} options.division
   * @return {Array}
   */
  async getStandings(options = {}) {
    const where = {};

    if (options.league_id) where.league_id = options.league_id;
    if (options.season_year) where.season_year = options.season_year;
    if (options.season_type) where.season_type = options.season_type;
    if (options.conference) where.conference = options.conference;
    if (options.division) where.division = options.division;

    const standings = await this.masterModel.findAll({
      where,
      order: [
        ['conference', 'ASC'],
        ['conference_rank', 'ASC'],
      ],
    });

    return standings;
  }

  /**
   * Bulk update/insert standings data
   * @param {Array} standingsData
   * @param {number} retryCount
   * @return {Object}
   */
  async bulkUpsertStandings(standingsData, retryCount = 3) {
    const results = {
      success: 0,
      updated: 0,
      inserted: 0,
      errors: [],
    };

    for (const standingData of standingsData) {
      let attempt = 0;
      let success = false;

      while (attempt < retryCount && !success) {
        try {
          const result = await this.upsertTeamStandings(standingData);

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
              `Attempt ${attempt} failed for team ${standingData.team_id}:`,
              error.message,
          );

          if (attempt >= retryCount) {
            results.errors.push({
              team_id: standingData.team_id,
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
        `Standings bulk upsert completed: ${results.success} success, ${results.errors.length} errors`,
    );
    return results;
  }

  /**
   * Upsert individual team standings
   * @param {Object} standingData
   * @return {Array} [instance, created]
   */
  async upsertTeamStandings(standingData) {
    try {
      const [instance, created] = await this.masterModel.upsert(
          {
            league_id: standingData.league_id || 1,
            team_id: standingData.team_id,
            season_year: standingData.season_year,
            season_type: standingData.season_type,
            conference: standingData.conference,
            conference_rank: standingData.conference_rank,
            conference_tiebreak: standingData.conference_tiebreak || null,
            conference_games_behind: isNaN(parseInt(standingData.conference_games_behind)) ?
            null :
            parseInt(standingData.conference_games_behind),
            division: standingData.division,
            division_rank: standingData.division_rank,
            division_tiebreak: standingData.division_tiebreak || null,
            division_games_behind: isNaN(parseInt(standingData.division_games_behind)) ?
            null :
            parseInt(standingData.division_games_behind),
            inprogress: standingData.inprogress || false,
            wins: standingData.records?.wins || 0,
            losses: standingData.records?.losses || 0,
            win_pct: standingData.records?.win_pct || '0.000',
            home_wins: standingData.records?.home_wins || 0,
            away_wins: standingData.records?.away_wins || 0,
            home_losses: standingData.records?.home_losses || 0,
            away_losses: standingData.records?.away_losses || 0,
            played: standingData.records?.played || 0,
            points: standingData.records?.points || 0,
            outcome: standingData.records?.outcome || '',
            updated_at_src: standingData.updated ? new Date(standingData.updated) : null,
            points_for: standingData.records?.points_for || '0.0',
            points_against: standingData.records?.points_against || '0.0',
            point_diff: standingData.records?.point_diff || '0.0',
            conference_wins: standingData.records?.conference_wins || 0,
            conference_losses: standingData.records?.conference_losses || 0,
            division_wins: standingData.records?.division_wins || 0,
            division_losses: standingData.records?.division_losses || 0,
          },
          {
            conflictFields: ['league_id', 'season_year', 'season_type', 'team_id'],
          },
      );

      return {instance, created};
    } catch (error) {
      console.error(`Failed to upsert standings for team ${standingData.team_id}:`, error);
      throw error;
    }
  }

  /**
   * Delete standings based on criteria
   * @param {Object} where Deletion criteria
   * @return {number} Number of deleted records
   */
  async deleteStandings(where) {
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

module.exports = StandingsRepository;
