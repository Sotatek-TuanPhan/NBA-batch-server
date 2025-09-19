/* eslint-disable new-cap */
module.exports = (sequelize, DataTypes) => {
  const Player = sequelize.define('player', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      comment: 'PK',
    },
    player_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      unique: true,
      comment: '外部供給側の自然キー',
    },
    team_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    player_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    first_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    last_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    height_cm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weight_kg: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    abbr_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    full_name_kana: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    abbr_name_kana: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    full_name_en_all: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    abbr_name_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    primary_position: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    jersey_number: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    birth_place: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    college: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    high_school: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(1024),
      allowNull: true,
    },
    profile_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profile_belonging_team: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profile_career: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profile_title: {
      type: DataTypes.TEXT,
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
    modelName: 'player',
    tableName: 'players',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['player_id'],
        name: 'ux_players_player_id',
      },
      {
        fields: ['team_id'],
        name: 'idx_players_team_id',
      },
      {
        fields: ['country_code'],
        name: 'idx_players_country_code',
      },
      {
        fields: ['full_name'],
        name: 'idx_players_full_name',
      },
      {
        fields: ['full_name_en_all'],
        name: 'idx_players_full_name_en_all',
      },
    ],
  });

  return Player;
};
