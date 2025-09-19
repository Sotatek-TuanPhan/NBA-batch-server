const data = [
  {
    setting_type_cd: 'rss',
    setting_key: 'livedoor_sports_rss',
    setting_val: 'https://news.livedoor.com/topics/rss/spo.xml',
    interval_minutes: 30,
    status_cd: 'enabled',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    setting_type_cd: 'rss',
    setting_key: 'test_rss',
    setting_val: 'http://localhost:3001/rss.xml',
    interval_minutes: 60,
    status_cd: 'enabled',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  IntegrationSettings: data,
};
