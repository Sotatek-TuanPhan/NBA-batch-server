/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const TournamentMatch = sequelize.define('tournament_match', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    tournament_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    round: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    round_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bracket_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    home_team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    home_seed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    home_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    away_team_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    away_seed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    away_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    winner_side: {
      type: DataTypes.STRING(10),
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
    modelName: 'tournament_match',
    tableName: 'tournament_matches',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['tournament_id', 'round', 'bracket_number'],
        name: 'idx_tournament_match',
      },
      {
        fields: ['home_team_id'],
        name: 'idx_tournament_matches_home_team',
      },
      {
        fields: ['away_team_id'],
        name: 'idx_tournament_matches_away_team',
      },
    ],
  });

  return TournamentMatch;
};
