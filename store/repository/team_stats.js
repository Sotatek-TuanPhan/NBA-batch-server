/**
 * Team Stats Repository
 */
class TeamStats {
  /**
   * Save team statistics
   * @param {Object} teamStatsData - Team statistics data
   * @returns {Promise<Object>} Saved team statistics
   */
  async saveTeamStats(teamStatsData) {
    try {
      // Check for duplicates (by team_id + season_year + season_type)
      const existingStats = await this.masterModel.findOne({
        where: {
          team_id: teamStatsData.team_id,
          season_year: teamStatsData.season_year,
          season_type: teamStatsData.season_type,
        },
      });

      if (existingStats) {
        // Update existing team stats
        const updatedStats = await existingStats.update(teamStatsData);
        return updatedStats;
      }

      // Save new team stats
      const savedStats = await this.masterModel.create(teamStatsData);
      return savedStats;
    } catch (error) {
      console.error('Team stats save error:', error);
      throw error;
    }
  }

  /**
   * Map API team statistics data to database format
   * @param {Object} statisticsData - API statistics data from team_statistics
   * @param {number} teamId - Team ID
   * @param {number} leagueId - League ID
   * @returns {Object} Mapped team statistics data for database
   */
  mapTeamStatsData(statisticsData, teamId, leagueId) {
    return {
      league_id: leagueId,
      team_id: teamId,
      season_year: statisticsData.season_year,
      season_type: statisticsData.season_type,
      games_played: statisticsData.team_statistics.games_played ? parseInt(statisticsData.team_statistics.games_played) : null,
      field_goals_att: statisticsData.team_statistics.field_goals_att ? parseInt(statisticsData.team_statistics.field_goals_att) : null,
      field_goals_made: statisticsData.team_statistics.field_goals_made ? parseInt(statisticsData.team_statistics.field_goals_made) : null,
      three_points_att: statisticsData.team_statistics.three_points_att ? parseInt(statisticsData.team_statistics.three_points_att) : null,
      three_points_made: statisticsData.team_statistics.three_points_made ? parseInt(statisticsData.team_statistics.three_points_made) : null,
      free_throws_att: statisticsData.team_statistics.free_throws_att ? parseInt(statisticsData.team_statistics.free_throws_att) : null,
      free_throws_made: statisticsData.team_statistics.free_throws_made ? parseInt(statisticsData.team_statistics.free_throws_made) : null,
      rebounds: statisticsData.team_statistics.rebounds ? parseInt(statisticsData.team_statistics.rebounds) : null,
      assists: statisticsData.team_statistics.assists ? parseInt(statisticsData.team_statistics.assists) : null,
      src_updated_at: new Date(),
    };
  }

  /**
   * Save team statistics from API data
   * @param {Object} seasonStatsData - Season statistics data from API
   * @param {number} teamId - Team ID
   * @returns {Promise<Object>} Saved team statistics
   */
  async saveTeamStatsFromApi(seasonStatsData, teamId) {
    // リーグIDを取得または作成
    const leagueId = await this.context.store.repository.League.findOrCreateLeague(seasonStatsData.league);

    const mappedData = this.mapTeamStatsData(seasonStatsData, teamId, leagueId);
    return await this.saveTeamStats(mappedData);
  }

  /**
   * Save multiple team statistics from API data
   * @param {Array} statisticsArray - Array of season statistics from API
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} Array of saved team statistics
   */
  async saveMultipleTeamStatsFromApi(statisticsArray, teamId) {
    const results = [];

    for (const seasonStats of statisticsArray) {
      try {
        const savedStats = await this.saveTeamStatsFromApi(seasonStats, teamId);
        results.push(savedStats);
      } catch (error) {
        console.error(`Error saving team stats for team ${teamId}, season ${seasonStats.season_year}, type ${seasonStats.season_type}:`, error);
      }
    }

    return results;
  }
}

module.exports = TeamStats;
