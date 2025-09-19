/**
 * Newsモデル
 */
module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      comment: 'ID',
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      comment: 'ニュースID (UUID)',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'タイトル',
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '本文',
    },
    source_cd: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '配信元（共同/ライブドア等）',
    },
    published_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '配信日',
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: '元記事URL',
    },
    image_url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'サムネイル',
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'タグ',
    },
    status_cd: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'public',
      comment: '公開/非公開',
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
    tableName: 'news',
    timestamps: true,
    paranoid: true, // 論理削除を有効化
    indexes: [
      {
        fields: ['source_cd'],
      },
      {
        fields: ['status_cd'],
      },
      {
        fields: ['published_at'],
      },
      {
        fields: ['uuid'],
        unique: true,
      },
    ],
  });

  return News;
};
