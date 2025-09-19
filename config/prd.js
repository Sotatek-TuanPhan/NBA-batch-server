module.exports = {
  stores: {
    master: {
      dialect: 'mysql',
      host: 'ny-aurora-mysql-prd.cluster-cd46iq00otlb.ap-northeast-1.rds.amazonaws.com',
      username: 'docomo_ny',
      password: process.env.MYSQL_USER_PASSWORD,
      database: 'docomo_ny_production',
      logging: false,
    },
  },
  kyodo_base_url: 'https://basket.sports-digican.com/nba/contents/json',
};
