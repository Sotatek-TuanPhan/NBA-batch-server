module.exports = (sequelize, DataTypes) => {
  const GameTeamStats = sequelize.define('game_team_stats', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    minutes: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    points: {
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
    steals: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    blocks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    field_goals_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    field_goals_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    field_goals_pct: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    three_points_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    three_points_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    three_points_pct: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    free_throws_made: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    free_throws_att: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    free_throws_pct: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    offensive_rebounds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    defensive_rebounds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    turnovers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    points_off_turnovers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    personal_fouls: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    remaining_timeouts: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: 'game_team_stats',
    tableName: 'game_team_stats',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['game_id', 'team_id'],
        name: 'ux_game_team_stats_game_team',
      },
      {
        fields: ['game_id'],
        name: 'idx_game_team_stats_game_id',
      },
      {
        fields: ['team_id'],
        name: 'idx_game_team_stats_team_id',
      },
    ],
  },
  );

  return GameTeamStats;
};
