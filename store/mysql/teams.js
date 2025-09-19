module.exports = (sequelize, DataTypes) => {
  const Teams = sequelize.define('Teams', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    league_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name_alias: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    name_en: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name_alias_en: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    abbr_name: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    abbr_name_en: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    market: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    conference: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    division: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    home_venue_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    founded_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    logo_url: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(512),
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
  }, {
    tableName: 'teams',
    timestamps: true,
  });

  return Teams;
};
