module.exports = (sequelize, DataTypes) => {
  const TeamLeaders = sequelize.define('TeamLeaders', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    league_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    season_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    season_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    statistic: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    statistic_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    player_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    statistic_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
  }, {
    tableName: 'team_leaders',
    timestamps: true,
  });

  return TeamLeaders;
};
