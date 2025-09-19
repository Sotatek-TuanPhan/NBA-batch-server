const context = require('../context');

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
  kyodoTeamsApi,
};
