module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
      'schedule',
      {
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
        game_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: true,
        },
        scheduled: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
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
      },
      {
        modelName: 'schedule',
        tableName: 'schedules',
        timestamps: true,
        underscored: true,
        indexes: [
          {
            name: 'ux_schedules_game',
            unique: true,
            fields: ['game_id'],
          },
          {
            name: 'idx_schedules_league_scheduled',
            fields: ['league_id', 'scheduled'],
          },
        ],
      },
  );

  return Schedule;
};
