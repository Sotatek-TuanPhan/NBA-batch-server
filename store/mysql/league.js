/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const League = sequelize.define('league', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'リーグ名',
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
    modelName: 'league',
    tableName: 'leagues',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['name'],
        name: 'ux_leagues_name',
      },
    ],
  });

  return League;
};
