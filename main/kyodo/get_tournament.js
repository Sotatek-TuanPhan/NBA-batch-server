const context = require('../context');

/**
 * Kyodo Tournament API データ取得処理
 */
const kyodoTournamentApi = async () => {
  try {
    console.log('=== Kyodo Tournament API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // テスト用URL（後で設定から取得するように変更可能）
    const testUrl = context.config.kyodo_base_url + '/tournament.json';

    try {
      console.log(`トーナメントデータ取得開始: ${testUrl}`);

      // Kyodo APIからデータを取得
      const {data: tournamentData} = await kyodoApiFetcher.fetchData(testUrl);
      console.log(`トーナメントデータ取得完了: ${tournamentData.length}件のマッチ`);

      // ユニークなトーナメントを抽出して保存
      const uniqueTournaments = new Map();
      const savedTournaments = new Map();

      // 1. まずトーナメントを保存
      for (const match of tournamentData) {
        const key = `${match.league}_${match.season_year}_${match.season_type}`;
        if (!uniqueTournaments.has(key)) {
          const tournamentInfo = context.store.repository.Tournaments.mapTournamentData(match);
          uniqueTournaments.set(key, tournamentInfo);

          // トーナメントを保存してIDを取得
          const savedTournament = await context.store.repository.Tournaments.saveTournament(
              tournamentInfo,
          );
          savedTournaments.set(key, savedTournament.id);
        }
      }

      // 2. 次にマッチを保存
      for (const match of tournamentData) {
        const key = `${match.league}_${match.season_year}_${match.season_type}`;
        const tournamentId = savedTournaments.get(key);

        if (tournamentId) {
          const matchData = context.store.repository.TournamentMatches.mapMatchData(
              tournamentId,
              match,
          );
          await context.store.repository.TournamentMatches.saveMatch(matchData);
        }
      }

      console.log('トーナメントデータ保存完了');
      console.log(
          `トーナメント処理完了: ${uniqueTournaments.size}トーナメント, ${tournamentData.length}マッチ`,
      );
    } catch (error) {
      console.error(`トーナメント処理エラー: ${error}`);
      // エラーが発生しても処理は続行可能
    }

    console.log('=== Kyodo Tournament API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Tournament API データ取得処理エラー:', error);
    throw error;
  }
};

module.exports = {
  kyodoTournamentApi,
};
