const data = [
  {
    id: 1,
    league_id: 1,
    home_team_id: 1,
    away_team_id: 2,
    scheduled: new Date(),
    venue: 'Test Arena',
    status: 'scheduled',
    home_score: 100,
    away_score: 90,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  game: data,
};
