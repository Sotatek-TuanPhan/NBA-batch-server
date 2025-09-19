module.exports = (sequelize, DataTypes) => {
  const TeamStats = sequelize.define('team_stats', {
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
    season_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    season_type: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    games_played: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    field_goals_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    field_goals_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    three_points_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    three_points_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    free_throws_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    free_throws_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rebounds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    assists: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    src_updated_at: {
      type: DataTypes.DATE(6),
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
    modelName: 'team_stats',
    tableName: 'team_stats',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['team_id', 'season_year', 'season_type'],
        name: 'ux_team_stats_team_season',
      },
      {
        fields: ['team_id'],
        name: 'idx_team_stats_team_id',
      },
      {
        fields: ['season_year', 'season_type'],
        name: 'idx_team_stats_season',
      },
    ],
  });

  return TeamStats;
};
