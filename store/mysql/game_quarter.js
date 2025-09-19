module.exports = (sequelize, DataTypes) => {
  const GameQuarter = sequelize.define('game_quarter', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    game_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quarter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    home_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    away_score: {
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
    modelName: 'game_quarter',
    tableName: 'game_quarters',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['game_id', 'quarter'],
        name: 'ux_game_quarters_unique',
      },
      {
        fields: ['game_id'],
        name: 'idx_game_quarters_game_id',
      },
    ],
  },
  );

  return GameQuarter;
};
