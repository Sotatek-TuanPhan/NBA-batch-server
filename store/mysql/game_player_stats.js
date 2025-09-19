module.exports = (sequelize, DataTypes) => {
  const GamePlayerStats = sequelize.define('game_player_stats', {
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
    player_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    played: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    starter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    on_court: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    personal_fouls: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    efficiency: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    pls_min: {
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
    modelName: 'game_player_stats',
    tableName: 'game_player_stats',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['game_id', 'player_id'],
        name: 'ux_game_player_stats_game_player',
      },
      {
        fields: ['game_id'],
        name: 'idx_game_player_stats_game_id',
      },
      {
        fields: ['team_id'],
        name: 'idx_game_player_stats_team_id',
      },
      {
        fields: ['player_id'],
        name: 'idx_game_player_stats_player_id',
      },
    ],
  },
  );

  return GamePlayerStats;
};
