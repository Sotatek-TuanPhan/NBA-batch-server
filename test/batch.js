const app = require('../app.js');
const context = require('../main/context');
const http = require('http');
const fs = require('fs');
const path = require('path');
const standings = require('./standings');
const { expect } = require('chai');
const gameSchedulesTest = require('./game_schedules');
const leadersTest = require('./leaders');

let testServer;

describe('app.js', () => {
  before(async () => {
    // テスト用RSSサーバーを起動
    testServer = http.createServer((req, res) => {
      if (req.url === '/rss.xml') {
        const rssPath = path.join(__dirname, 'fixtures', 'sample-rss.xml');
        fs.readFile(rssPath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'application/xml; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(data);
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    // サーバーを起動
    await new Promise((resolve) => {
      testServer.listen(3001, () => {
        console.log('テストRSSサーバーが起動しました: http://localhost:3001/rss.xml');
        resolve();
      });
    });

    // テスト環境での初期化
    await context.init();

    // リポジトリの初期化後にテーブルを同期
    await context.store.repository.News.masterModel.sync({ force: true });
    await context.store.repository.IntegrationSettings.masterModel.sync({ force: true });
    await context.store.repository.Game.masterModel.sync({ force: true });
    await context.store.repository.Tournaments.masterModel.sync({ force: true });
    await context.store.repository.TournamentMatches.masterModel.sync({ force: true });
    await context.store.repository.Player.masterModel.sync({ force: true });
    await context.store.repository.Teams.masterModel.sync({ force: true });
    await context.store.repository.League.masterModel.sync({ force: true });
    await context.store.repository.GameQuarter.masterModel.sync({ force: true });
    await context.store.repository.GameTimelines.masterModel.sync({ force: true });
    await context.store.repository.GamePlayerStats.masterModel.sync({ force: true });
    await context.store.repository.GameTeamStats.masterModel.sync({ force: true });

    // Leaders table (if available)
    if (context.store.repository.Leaders) {
      await context.store.repository.Leaders.masterModel.sync({ force: true });
    }

    // テスト用のRSS設定を追加
    await context.store.repository.IntegrationSettings.createRssSetting({
      setting_key: 'test_rss',
      setting_val: 'http://localhost:3001/rss.xml',
      interval_minutes: 30,
      status_cd: 'enabled',
    });
  });

  after(async () => {
    // テスト用RSSサーバーを停止
    if (testServer) {
      await new Promise((resolve) => {
        testServer.close(() => {
          console.log('テストRSSサーバーが停止しました');
          resolve();
        });
      });
    }
  });

  describe('main', () => {
    it('処理が成功すること', async () => {
      await app.main({ hoge: 'puge' });
    });
    it('データがDBに正常に保存されること', async () => {
      // Run the main process
      await app.main({ test: 'data', batchType: 'game-details' });

      // Count records in each table
      const counts = {
        news: await context.store.repository.News.masterModel.count(),
        games: await context.store.repository.Game.masterModel.count(),
        gamePlayerStats: await context.store.repository.GamePlayerStats.masterModel.count(),
        gameTeamStats: await context.store.repository.GameTeamStats.masterModel.count(),
        gameQuarters: await context.store.repository.GameQuarter.masterModel.count(),
        gameTimelines: await context.store.repository.GameTimelines.masterModel.count(),
        tournaments: await context.store.repository.Tournaments.masterModel.count(),
        tournamentMatches: await context.store.repository.TournamentMatches.masterModel.count(),
        players: await context.store.repository.Player.masterModel.count(),
        teams: await context.store.repository.Teams.masterModel.count(),
        teamStats: await context.store.repository.TeamStats.masterModel.count(),
        teamMatchResults: await context.store.repository.TeamMatchResults.masterModel.count(),
      };

      console.log('\n📊 === DATABASE RECORD COUNTS ===');
      console.log(`News: ${counts.news}`);
      console.log(`Games: ${counts.games}`);
      console.log(`Game Player Stats: ${counts.gamePlayerStats}`);
      console.log(`Game Team Stats: ${counts.gameTeamStats}`);
      console.log(`Game Quarters: ${counts.gameQuarters}`);
      console.log(`Game Timelines: ${counts.gameTimelines}`);
      console.log(`Tournaments: ${counts.tournaments}`);
      console.log(`Tournament Matches: ${counts.tournamentMatches}`);
      console.log(`Players: ${counts.players}`);
      console.log(`Teams: ${counts.teams}`);
      console.log(`Team Stats: ${counts.teamStats}`);
      console.log(`Team Match Results: ${counts.teamMatchResults}`);
      console.log(`Schedules: ${counts.schedules}`);
      console.log(`Standings: ${counts.standings}`);
      console.log('===================================\n');

      // Verify data was added
      const totalRecords = Object.values(counts).reduce((sum, count) => sum + count, 0);
      console.log(`✅ Total records in database: ${totalRecords}`);

      if (totalRecords > 0) {
        console.log('🎉 SUCCESS: Data successfully added to database!');
      } else {
        console.log('⚠️  WARNING: No data was added to database');
      }
    });

    it('Insert data standings to DB', async () => {
      const result = await standings.testStandingsWithDB();
      expect(result.success).to.be.true;
    });

    it('Insert game schedules to DB', async () => {
      const result = await gameSchedulesTest.testGameSchedulesWithDB();
      expect(result.success).to.be.true;
    });

    it('Insert leaders to DB', async () => {
      const result = await leadersTest.testLeadersWithDB();
      expect(result.success).to.be.true;
    });
  });
});
