const data = [
  {
    id: 1,
    game_id: 32653,
    league_id: 1,
    home_team_id: 1,
    away_team_id: 2,
    season_year: 2024,
    season_type: 'regular',
    game_reference: 'TEST-001',
    game_status: 'scheduled',
    game_quarter: null,
    game_quarter_time_left: null,
    game_title: 'Test Game',
    scheduled_dt: new Date(),
    started_dt: null,
    ended_dt: null,
    venue: {'name': 'Test Arena', 'city': 'Test City'},
    home_score: 100,
    away_score: 90,
    winner_team_id: 1,
    meta: {'test': true},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  game: data,
};
