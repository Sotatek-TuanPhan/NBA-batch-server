module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('games', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    league_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    home_team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    away_team_id: {
      type: DataTypes.BIGINT,
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
    game_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    game_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    game_quarter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    game_quarter_time_left: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    game_title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    scheduled_dt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    started_dt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ended_dt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    venue: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    home_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    away_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winner_team_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    meta: {
      type: DataTypes.JSON,
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
    modelName: 'games',
    tableName: 'games',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: 'ux_games_game_id',
        unique: true,
        fields: ['game_id'],
      },
      {
        name: 'idx_games_league_id',
        fields: ['league_id'],
      },
      {
        name: 'idx_games_home_team_id',
        fields: ['home_team_id'],
      },
      {
        name: 'idx_games_away_team_id',
        fields: ['away_team_id'],
      },
      {
        name: 'idx_games_scheduled_dt',
        fields: ['scheduled_dt'],
      },
      {
        name: 'idx_games_game_status',
        fields: ['game_status'],
      },
      {
        name: 'idx_games_season',
        fields: ['season_year', 'season_type'],
      },
    ],
  });

  return Game;
};
