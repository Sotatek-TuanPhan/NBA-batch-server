const getData = require('./get_data');
const rssFetcher = require('./rss_fetcher');
const getStandings = require('./get_standings');
const getGameSchedules = require('./get_game_schedules');
const getGameDetail = require('./get_game_detail');
const getTournament = require('./get_tournament');
const getPlayerDetail = require('./get_player_detail');
const getTeams = require('./get_teams');
const getLeaders = require('./get_leader');

module.exports = {
  getData: getData,
  rssFetcher: rssFetcher,
  getStandings: getStandings,
  getGameSchedules: getGameSchedules,
  getGameDetail: getGameDetail,
  getTournament: getTournament,
  getPlayerDetail: getPlayerDetail,
  getTeams: getTeams,
  getLeaders: getLeaders,
};
