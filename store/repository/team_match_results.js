/**
 * Team Match Results Repository
 */
class TeamMatchResults {
  /**
   * Save team match results
   * @param {Object} matchResultData - Team match result data
   * @returns {Promise<Object>} Saved team match result
   */
  async saveTeamMatchResult(matchResultData) {
    try {
      // Check for duplicates (by team_id + opponent_team_id + season_year + season_type + split)
      const existingResult = await this.masterModel.findOne({
        where: {
          team_id: matchResultData.team_id,
          opponent_team_id: matchResultData.opponent_team_id,
          season_year: matchResultData.season_year,
          season_type: matchResultData.season_type,
          split: matchResultData.split,
        },
      });

      if (existingResult) {
        // Update existing match result
        const updatedResult = await existingResult.update(matchResultData);
        return updatedResult;
      }

      // Save new match result
      const savedResult = await this.masterModel.create(matchResultData);
      return savedResult;
    } catch (error) {
      console.error('Team match result save error:', error);
      throw error;
    }
  }

  /**
   * Map API match result data to database format
   * @param {Object} matchResultData - API match result data
   * @param {number} teamId - Main team ID
   * @param {number} leagueId - League ID
   * @param {number} seasonYear - Season year
   * @param {string} seasonType - Season type
   * @param {string} split - Split type (home/away/total)
   * @returns {Object} Mapped match result data for database
   */
  mapMatchResultData(matchResultData, teamId, leagueId, seasonYear, seasonType, split) {
    const splitData = matchResultData[split];

    return {
      league_id: leagueId,
      team_id: teamId,
      opponent_team_id: matchResultData.team.team_id,
      season_year: seasonYear,
      season_type: seasonType,
      split: split,
      wins: splitData.wins || 0,
      losses: splitData.losses || 0,
      played: splitData.played || 0,
      points_for: splitData.points_for || 0,
      points_against: splitData.points_against || 0,
      average_points_for: splitData.average_points_for ? parseFloat(splitData.average_points_for) : 0,
      average_points_against: splitData.average_points_against ? parseFloat(splitData.average_points_against) : 0,
    };
  }

  /**
   * Save team match result from API data
   * @param {Object} matchResultData - API match result data
   * @param {number} teamId - Main team ID
   * @param {string} leagueName - League name
   * @param {number} seasonYear - Season year
   * @param {string} seasonType - Season type
   * @param {string} split - Split type (home/away/total)
   * @returns {Promise<Object>} Saved team match result
   */
  async saveTeamMatchResultFromApi(matchResultData, teamId, leagueName, seasonYear, seasonType, split) {
    // リーグIDを取得または作成
    const leagueId = await this.context.store.repository.League.findOrCreateLeague(leagueName);

    const mappedData = this.mapMatchResultData(matchResultData, teamId, leagueId, seasonYear, seasonType, split);
    return await this.saveTeamMatchResult(mappedData);
  }

  /**
   * Save multiple team match results from API data (all splits for one match result)
   * @param {Object} matchResultData - API match result data
   * @param {number} teamId - Main team ID
   * @param {string} leagueName - League name
   * @param {number} seasonYear - Season year
   * @param {string} seasonType - Season type
   * @returns {Promise<Array>} Array of saved team match results
   */
  async saveAllSplitsFromApi(matchResultData, teamId, leagueName, seasonYear, seasonType) {
    const results = [];
    const splits = ['home', 'away', 'total'];

    for (const split of splits) {
      try {
        if (matchResultData[split]) {
          const savedResult = await this.saveTeamMatchResultFromApi(
              matchResultData,
              teamId,
              leagueName,
              seasonYear,
              seasonType,
              split,
          );
          results.push(savedResult);
        }
      } catch (error) {
        console.error(`Error saving team match result for team ${teamId}, opponent ${matchResultData.team?.team_id}, split ${split}:`, error);
      }
    }

    return results;
  }

  /**
   * Save multiple team match results from API data array
   * @param {Array} matchResultsArray - Array of match result data from API
   * @param {number} teamId - Main team ID
   * @param {string} leagueName - League name
   * @param {number} seasonYear - Season year
   * @param {string} seasonType - Season type
   * @returns {Promise<Array>} Array of saved team match results
   */
  async saveMultipleMatchResultsFromApi(matchResultsArray, teamId, leagueName, seasonYear, seasonType) {
    const results = [];

    for (const matchResult of matchResultsArray) {
      try {
        const savedResults = await this.saveAllSplitsFromApi(
            matchResult,
            teamId,
            leagueName,
            seasonYear,
            seasonType,
        );
        results.push(...savedResults);
      } catch (error) {
        console.error(`Error saving match results for team ${teamId}, opponent ${matchResult.team?.team_id}:`, error);
      }
    }

    return results;
  }
}

module.exports = TeamMatchResults;
