module.exports = (sequelize, DataTypes) => {
  const Leaders = sequelize.define('leaders', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    league_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    leader_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    season_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    src_updated_at: {
      type: DataTypes.DATE,
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
    tableName: 'leaders',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['league_id', 'category', 'category_type', 'season_type'],
        name: 'ux_leaders_league_cat_type_season',
      },
      {
        fields: ['leader_id'],
        name: 'idx_leaders_leader_id',
      },
      {
        fields: ['league_id'],
        name: 'idx_leaders_league_id',
      },
      {
        fields: ['category', 'season_type'],
        name: 'idx_leaders_category_season',
      },
    ],
  });

  return Leaders;
};
