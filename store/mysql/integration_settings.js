/**
 * IntegrationSettingsモデル
 */
module.exports = (sequelize, DataTypes) => {
  const IntegrationSettings = sequelize.define('IntegrationSettings', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: '設定ID',
    },
    setting_type_cd: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'rss/brightcove等',
    },
    setting_key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'rss_url/client_id等（valueは避ける）',
    },
    setting_val: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '設定値',
    },
    interval_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '巡回間隔の設定',
    },
    status_cd: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'enabled/disabled等',
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
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at',
      comment: '論理削除',
    },
  }, {
    tableName: 'integration_settings',
    timestamps: true,
    paranoid: true, // 論理削除を有効化
    indexes: [
      {
        fields: ['setting_type_cd'],
      },
      {
        fields: ['setting_key'],
        unique: true,
      },
      {
        fields: ['status_cd'],
      },
    ],
  });

  return IntegrationSettings;
};
