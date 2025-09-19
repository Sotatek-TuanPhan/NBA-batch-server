const context = require('#context');

/**
 * メイン処理
 */
const main = async () => {
  try {
    console.log('=== RSS取得処理開始 ===');

    // 取得対象のRSS設定を取得
    const fetchableSettings =
      await context.store.repository.IntegrationSettings.getFetchableRssSettings();
    console.log(`${fetchableSettings.length}件のRSS設定が取得対象です`);

    if (fetchableSettings.length === 0) {
      console.log('取得対象のRSS設定がありません');
      return;
    }

    const rssFetcher = require('./rss_fetcher');
    let totalProcessed = 0;

    // 各RSS設定に対して処理を実行
    for (const setting of fetchableSettings) {
      try {
        console.log(`RSS取得開始: ${setting.setting_key} (${setting.setting_val})`);

        // RSSを取得
        const articles = await rssFetcher.fetchRssBySetting(setting);
        console.log(`${articles.length}件の記事を取得しました`);

        // DBに保存
        if (articles.length > 0) {
          const savedArticles = await context.store.repository.News.saveArticles(articles);
          console.log(`${savedArticles.length}件の記事を保存しました`);
          totalProcessed += savedArticles.length;
        }

        console.log(`RSS取得完了: ${setting.setting_key}`);
      } catch (error) {
        console.error(`RSS取得エラー (${setting.setting_key}):`, error);
        // エラーが発生しても他の設定の処理は続行
      }
    }

    // 統計情報を表示
    const stats = await context.store.repository.News.getStats();
    console.log('=== 統計情報 ===');
    console.log(`総記事数: ${stats.totalCount}件`);
    console.log(`今回処理件数: ${totalProcessed}件`);
    console.log('ソース別統計:');
    stats.sourceStats.forEach((stat) => {
      console.log(`  ${stat.source_cd}: ${stat.dataValues.count}件`);
    });

    console.log('=== RSS取得処理完了 ===');
  } catch (error) {
    console.error('RSS取得処理エラー:', error);
    throw error;
  }
};

/**
 * Kyodo Game Detail API データ取得処理
 */
const kyodoGameDetailApi = async () => {
  try {
    console.log('=== Kyodo Game Detail API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // テスト用URL（後で設定から取得するように変更可能）
    const testUrl = context.config.kyodo_base_url + '/game_32656.json';

    try {
      console.log(`ゲームデータ取得開始: ${testUrl}`);

      // Kyodo APIからデータを取得
      const {data: gameData} = await kyodoApiFetcher.fetchData(testUrl);
      console.log(`ゲームデータ取得完了: Game ID ${gameData.game_id}`);

      // 各リポジトリを使用してデータを保存
      await context.store.repository.Game.saveGameData(gameData);
      await context.store.repository.GameQuarter.saveQuartersData(gameData);
      await context.store.repository.GameTeamStats.saveTeamStatsData(gameData);
      await context.store.repository.GamePlayerStats.savePlayerStatsData(gameData);
      await context.store.repository.GameTimelines.saveTimelineData(gameData);

      console.log('ゲームデータ保存完了');
      console.log(`ゲーム処理完了: ${gameData.game_id}`);
    } catch (error) {
      console.error(`ゲーム処理エラー: ${error}`);
      // エラーが発生しても処理は続行可能
    }

    console.log('=== Kyodo Game Detail API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Game Detail API データ取得処理エラー:', error);
    throw error;
  }
};

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

/**
 * Kyodo Player Detail API データ取得処理
 */
const kyodoPlayerDetailApi = async () => {
  try {
    console.log('=== Kyodo Player Detail API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // テスト用URL（後で設定から取得するように変更可能）
    const testUrl = context.config.kyodo_base_url + '/player_499.json';

    try {
      console.log(`プレイヤーデータ取得開始: ${testUrl}`);

      // Kyodo APIからデータを取得
      const {data: playerData} = await kyodoApiFetcher.fetchData(testUrl);
      console.log(`プレイヤーデータ取得完了: Player ID ${playerData.player_id}`);

      // プレイヤーリポジトリを使用してデータを保存
      await context.store.repository.Player.savePlayerDetailData(playerData);

      console.log('プレイヤーデータ保存完了');
      console.log(`プレイヤー処理完了: ${playerData.player_id}`);
    } catch (error) {
      console.error(`プレイヤー処理エラー: ${error}`);
      // エラーが発生しても処理は続行可能
    }

    console.log('=== Kyodo Player Detail API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Player Detail API データ取得処理エラー:', error);
    throw error;
  }
};

/**
 * Kyodo Teams API データ取得処理
 */
const kyodoTeamsApi = async () => {
  try {
    console.log('=== Kyodo Teams API データ取得処理開始 ===');

    const kyodoApiFetcher = require('./kyodo_api_fetcher');

    // NBA Teams API URL
    const teamsUrl = context.config.kyodo_base_url + '/teams.json';

    try {
      console.log(`チームデータ取得開始: ${teamsUrl}`);

      // Kyodo APIからデータを取得
      const {data: teamsData} = await kyodoApiFetcher.fetchData(teamsUrl);
      console.log(`チームデータ取得完了: ${teamsData.length}件のチーム`);

      // 各チームとプレイヤーを並行して処理
      let totalTeamsProcessed = 0;
      let totalPlayersProcessed = 0;
      let totalTeamStatsProcessed = 0;
      let totalMatchResultsProcessed = 0;

      for (const teamData of teamsData) {
        try {
          // チームを保存（リポジトリ内でマッピング）
          await context.store.repository.Teams.saveTeamFromApi(teamData);
          totalTeamsProcessed++;

          // チーム統計データを処理
          if (teamData.statistics && teamData.statistics.season && teamData.statistics.season.length > 0) {
            try {
              const statsResults = await context.store.repository.TeamStats.saveMultipleTeamStatsFromApi(
                  teamData.statistics.season,
                  teamData.team_id,
              );
              totalTeamStatsProcessed += statsResults.length;
              console.log(`チーム統計保存完了: ${teamData.team_name} (${statsResults.length}シーズン)`);
            } catch (error) {
              console.error(`チーム統計保存エラー (${teamData.team_name}):`, error);
              // エラーが発生しても他の処理は続行
            }
          }

          // チーム対戦結果データを処理
          if (teamData.match_results && teamData.match_results.length > 0) {
            try {
              // 各統計シーズンデータからleagueとseason情報を取得
              if (teamData.statistics && teamData.statistics.season && teamData.statistics.season.length > 0) {
                for (const seasonData of teamData.statistics.season) {
                  const matchResultsForSeason = await context.store.repository.TeamMatchResults.saveMultipleMatchResultsFromApi(
                      teamData.match_results,
                      teamData.team_id,
                      seasonData.league,
                      seasonData.season_year,
                      seasonData.season_type,
                  );
                  totalMatchResultsProcessed += matchResultsForSeason.length;
                }
                console.log(`チーム対戦結果保存完了: ${teamData.team_name} (${teamData.match_results.length}対戦相手)`);
              }
            } catch (error) {
              console.error(`チーム対戦結果保存エラー (${teamData.team_name}):`, error);
              // エラーが発生しても他の処理は続行
            }
          }

          // プレイヤーデータを並行処理
          if (teamData.players && teamData.players.length > 0) {
            const playerPromises = teamData.players.map(async (playerData) => {
              try {
                // プレイヤーを保存（リポジトリ内でマッピング）
                await context.store.repository.Player.savePlayerFromTeams(
                    playerData,
                    teamData.team_id,
                );
                return 1;
              } catch (error) {
                console.error(`プレイヤー保存エラー (${playerData.player_id}):`, error);
                return 0;
              }
            });

            const playerResults = await Promise.all(playerPromises);
            totalPlayersProcessed += playerResults.reduce((sum, result) => sum + result, 0);
          }

          console.log(`チーム処理完了: ${teamData.team_name} (ID: ${teamData.team_id})`);
        } catch (error) {
          console.error(`チーム処理エラー (${teamData.team_name}):`, error);
          // エラーが発生しても他のチームの処理は続行
        }
      }

      console.log('チーム・プレイヤー・統計・対戦結果データ保存完了');
      console.log(`処理完了: ${totalTeamsProcessed}チーム, ${totalPlayersProcessed}プレイヤー, ${totalTeamStatsProcessed}チーム統計, ${totalMatchResultsProcessed}対戦結果`);
    } catch (error) {
      console.error(`チーム処理エラー: ${error}`);
    }

    console.log('=== Kyodo Teams API データ取得処理完了 ===');
  } catch (error) {
    console.error('Kyodo Teams API データ取得処理エラー:', error);
    throw error;
  }
};

module.exports = {
  main: main,
  kyodoGameDetailApi: kyodoGameDetailApi,
  kyodoTournamentApi: kyodoTournamentApi,
  kyodoPlayerDetailApi: kyodoPlayerDetailApi,
  kyodoTeamsApi: kyodoTeamsApi,
};
