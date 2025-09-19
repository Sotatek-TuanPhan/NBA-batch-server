/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define('tournament', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    league: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    season_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    season_type: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    end_date: {
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
    modelName: 'tournament',
    tableName: 'tournaments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'season_year', 'season_type'],
        name: 'uq_tournaments',
      },
    ],
  });

  return Tournament;
};
