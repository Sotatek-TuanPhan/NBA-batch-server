/**
 * Standings Model
 */
module.exports = (sequelize, DataTypes) => {
  const Standings = sequelize.define(
      'Standings',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        league_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        team_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        season_year: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        season_type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        conference: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        conference_rank: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        conference_tiebreak: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        conference_games_behind: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        division: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        division_rank: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        division_tiebreak: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        division_games_behind: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        inprogress: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        losses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        win_pct: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        home_wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        away_wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        home_losses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        away_losses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        played: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        points: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        outcome: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        updated_at_src: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        points_for: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        points_against: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        point_diff: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        conference_wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        conference_losses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        division_wins: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        division_losses: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
      },
      {
        tableName: 'standings',
        timestamps: true,
        indexes: [
          {
            unique: true,
            fields: ['league_id', 'season_year', 'season_type', 'team_id'],
            name: 'unique_team_season',
          },
          {
            fields: ['team_id'],
          },
          {
            fields: ['league_id'],
          },
          {
            fields: ['season_year', 'season_type', 'conference', 'conference_rank'],
          },
          {
            fields: ['season_year', 'season_type', 'division', 'division_rank'],
          },
        ],
      },
  );

  /**
   * Associate models. (Not used currently)
   * @param {Object} models All models
   * @return {Array} Relations (Empty for now)
   */
  Standings.associate = (models) => {
    return [];
  };

  return Standings;
};
