/**
 * Teams Repository
 */
class Teams {
  /**
   * Save team
   * @param {Object} teamData - Team data
   * @returns {Promise<Object>} Saved team
   */
  async saveTeam(teamData) {
    try {
      // Check for duplicates (by league_id + team_id)
      const existingTeam = await this.masterModel.findOne({
        where: {
          league_id: teamData.league_id,
          team_id: teamData.team_id,
        },
      });

      if (existingTeam) {
        // Update existing team
        const updatedTeam = await existingTeam.update(teamData);
        console.log(`Team updated: ${teamData.name} (ID: ${teamData.team_id})`);
        return updatedTeam;
      }

      // Save new team
      const savedTeam = await this.masterModel.create(teamData);
      console.log(`Team saved: ${teamData.name} (ID: ${teamData.team_id})`);
      return savedTeam;
    } catch (error) {
      console.error('Team save error:', error);
      throw error;
    }
  }

  /**
   * Map API team data to database format
   * @param {Object} teamData - API team data
   * @returns {Object} Mapped team data for database
   */
  mapTeamData(teamData) {
    return {
      league_id: 1, // NBA league ID (can be configured)
      team_id: teamData.team_id,
      name: teamData.team_name,
      name_alias: teamData.team_name_alias,
      name_en: teamData.team_name_en,
      name_alias_en: teamData.team_name_alias_en,
      abbr_name: teamData.team_name_alias,
      abbr_name_en: teamData.team_name_alias_en,
      city: teamData.market,
      market: teamData.market,
      country_code: teamData.country_code,
      conference: teamData.conference,
      division: teamData.division,
      home_venue_id: teamData.profile?.venue?.venue_id || null,
      founded_year: teamData.profile?.founded ? parseInt(teamData.profile.founded) : null,
      logo_url: teamData.team_logo_url,
      image_url: teamData.image_url,
    };
  }

  /**
   * Save team from API data
   * @param {Object} teamData - API team data
   * @returns {Promise<Object>} Saved team
   */
  async saveTeamFromApi(teamData) {
    const mappedData = this.mapTeamData(teamData);
    return await this.saveTeam(mappedData);
  }
}

module.exports = Teams;
