const { v4: uuidv4 } = require('uuid');

const data = [
  {
    uuid: uuidv4(),
    title: 'テスト記事1',
    body: 'これはテスト記事1の説明です',
    url: 'https://example.com/article1',
    published_at: new Date('2024-01-01T10:00:00Z'),
    image_url: 'https://example.com/image1.jpg',
    source_cd: 'livedoor',
    status_cd: 'public',
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    uuid: uuidv4(),
    title: 'テスト記事2',
    body: 'これはテスト記事2の説明です',
    url: 'https://example.com/article2',
    published_at: new Date('2024-01-01T11:00:00Z'),
    image_url: null,
    source_cd: 'livedoor',
    status_cd: 'public',
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  News: data,
};
