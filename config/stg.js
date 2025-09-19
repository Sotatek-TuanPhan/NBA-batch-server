module.exports = {
  stores: {
    master: {
      dialect: 'mysql',
      host: 'ny-aurora-mysql-stg.cluster-cxckia84oela.ap-northeast-1.rds.amazonaws.com',
      username: 'docomo_ny',
      password: process.env.MYSQL_USER_PASSWORD,
      database: 'docomo_ny_staging',
      logging: false,
    },
  },
};
