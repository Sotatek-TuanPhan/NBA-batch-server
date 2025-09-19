module.exports = (sequelize, DataTypes) => {
  const GameTimelines = sequelize.define('game_timelines', {
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
    sequence: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quarter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clock: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    side: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
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
    modelName: 'game_timelines',
    tableName: 'game_timelines',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['game_id'],
        name: 'idx_game_timelines_game_id',
      },
    ],
  },
  );

  return GameTimelines;
};
