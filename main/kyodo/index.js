const getData = require('./get_data');
const rssFetcher = require('./rss_fetcher');
const getStandings = require('./get_standings');
const getGameSchedules = require('./get_game_schedules');

module.exports = {
  getData: getData,
  rssFetcher: rssFetcher,
  getStandings: getStandings,
  getGameSchedules: getGameSchedules,
};
