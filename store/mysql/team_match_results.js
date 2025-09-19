/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const TeamMatchResults = sequelize.define('team_match_results', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    league_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    opponent_team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    season_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    season_type: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    split: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    wins: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    losses: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    played: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points_for: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points_against: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    average_points_for: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: true,
    },
    average_points_against: {
      type: DataTypes.DECIMAL(6, 1),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE(6),
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE(6),
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: 'team_match_results',
    tableName: 'team_match_results',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['league_id'],
        name: 'idx_tmr_league_id',
      },
      {
        fields: ['team_id'],
        name: 'idx_tmr_team_id',
      },
      {
        fields: ['opponent_team_id'],
        name: 'idx_tmr_opponent_team_id',
      },
      {
        fields: ['season_year', 'season_type'],
        name: 'idx_tmr_season',
      },
    ],
  });

  return TeamMatchResults;
};
