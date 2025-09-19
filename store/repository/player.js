/**
 * Playerリポジトリ
 */
class Player {
  /**
   * プレイヤー情報を保存/更新する
   * @param {Object} playerData - プレイヤーデータ
   * @returns {Promise<Object>} 保存されたプレイヤー
   */
  async savePlayer(playerData) {
    try {
      const result = await this.masterModel.upsert(playerData, {
        where: {
          player_id: playerData.player_id,
        },
      });

      return result[0];
    } catch (error) {
      console.error('Player save error:', error);
      throw error;
    }
  }

  /**
   * プレイヤー詳細データを処理して保存する
   * @param {Object} playerDetailData - プレイヤー詳細データ
   * @returns {Promise<void>}
   */
  async savePlayerDetailData(playerDetailData) {
    if (!playerDetailData || !playerDetailData.player_id) {
      console.log('プレイヤー詳細データが空またはplayer_idがありません');
      return;
    }

    try {
      // プレイヤーデータをマッピング
      const playerData = this.mapPlayerData(playerDetailData);
      await this.savePlayer(playerData);

      console.log(`プレイヤー詳細データ保存完了: ${playerDetailData.player_id}`);
    } catch (error) {
      console.error('プレイヤー詳細データ保存エラー:', error);
      throw error;
    }
  }

  /**
   * APIレスポンスからデータベース形式にマッピング
   * @param {Object} playerDetail - APIからのプレイヤー詳細データ
   * @returns {Object} データベース保存用プレイヤーデータ
   */
  mapPlayerData(playerDetail) {
    // 名前の分割処理 (full_nameから推測)
    const nameInfo = this.extractNames(playerDetail.full_name, playerDetail.full_name_en);

    // height/weightから数値抽出
    const heightCm = this.extractNumber(playerDetail.height);
    const weightKg = this.extractNumber(playerDetail.weight);

    // birth_dateの処理 (文字列からDATEONLY形式へ)
    const birthDate = this.formatBirthDate(playerDetail.birth_date);

    return {
      player_id: playerDetail.player_id,
      team_id: playerDetail.team?.team_id || null,
      player_reference: playerDetail.player_reference || null,
      first_name: nameInfo.firstName,
      last_name: nameInfo.lastName,
      first_name_en: nameInfo.firstNameEn,
      last_name_en: nameInfo.lastNameEn,
      position: playerDetail.position || null,
      country_code: playerDetail.team?.country_code || null,
      birth_date: birthDate,
      height_cm: heightCm,
      weight_kg: weightKg,
      full_name: playerDetail.full_name || null,
      abbr_name: playerDetail.abbr_name || null,
      full_name_kana: playerDetail.full_name_kana || null,
      abbr_name_kana: playerDetail.abbr_name_kana || null,
      full_name_en_all: playerDetail.full_name_en || null,
      abbr_name_en: playerDetail.abbr_name_en || null,
      primary_position: playerDetail.primary_position || null,
      jersey_number: playerDetail.jersey_number || null,
      birth_place: playerDetail.birth_place || null,
      college: playerDetail.college || null,
      high_school: playerDetail.high_school || null,
      image_url: playerDetail.image_url || null,
      profile_comment: playerDetail.profile?.comment || null,
      profile_belonging_team: playerDetail.profile?.belonging_team || null,
      profile_career: playerDetail.profile?.career || null,
      profile_title: playerDetail.profile?.title || null,
      meta: null,
    };
  }

  /**
   * 名前情報を抽出する (full_nameから推測)
   * @param {string} fullName - フルネーム
   * @param {string} fullNameEn - 英語フルネーム
   * @returns {Object} 名前情報
   */
  extractNames(fullName, fullNameEn) {
    let firstName = null;
    let lastName = null;
    let firstNameEn = null;
    let lastNameEn = null;

    // 日本語名前の分割 (スペースで分割)
    if (fullName && typeof fullName === 'string') {
      const nameParts = fullName.trim().split(/\s+/);
      if (nameParts.length >= 2) {
        firstName = nameParts[0]; // 姓
        lastName = nameParts[1]; // 名
      } else {
        firstName = fullName;
        lastName = '';
      }
    }

    // 英語名前の分割
    if (fullNameEn && typeof fullNameEn === 'string') {
      const namePartsEn = fullNameEn.trim().split(/\s+/);
      if (namePartsEn.length >= 2) {
        firstNameEn = namePartsEn[0]; // Given name
        lastNameEn = namePartsEn[namePartsEn.length - 1]; // Surname
      } else {
        firstNameEn = fullNameEn;
        lastNameEn = '';
      }
    }

    return {
      firstName: firstName || '',
      lastName: lastName || '',
      firstNameEn: firstNameEn || null,
      lastNameEn: lastNameEn || null,
    };
  }

  /**
   * 文字列から数値を抽出 (height: "180cm", weight: "75kg" など)
   * @param {string} str - 数値を含む文字列
   * @returns {number|null} 抽出された数値
   */
  extractNumber(str) {
    if (!str || typeof str !== 'string') {
      return null;
    }

    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * 生年月日をフォーマット (YYYY-MM-DD形式へ)
   * @param {string} birthDateStr - 生年月日文字列
   * @returns {string|null} フォーマットされた日付
   */
  formatBirthDate(birthDateStr) {
    if (!birthDateStr || typeof birthDateStr !== 'string') {
      return null;
    }

    try {
      // 様々な日付フォーマットに対応
      const date = new Date(birthDateStr);
      if (isNaN(date.getTime())) {
        return null;
      }

      // YYYY-MM-DD形式で返す
      return date.toISOString().split('T')[0];
    } catch {
      console.warn('Birth date format error:', birthDateStr);
      return null;
    }
  }

  /**
   * Map API player data to database format
   * @param {Object} playerData - API player data
   * @param {number} teamId - Team ID
   * @returns {Object} Mapped player data for database
   */
  mapPlayerDataFromTeams(playerData, teamId) {
    // 名前の分割処理
    const nameInfo = this.extractNames(playerData.full_name, playerData.full_name_en);
    
    // height/weightから数値抽出
    const heightCm = this.extractNumber(playerData.height);
    const weightKg = this.extractNumber(playerData.weight);
    
    // birth_dateの処理
    const birthDate = this.formatBirthDate(playerData.birth_date);

    return {
      player_id: playerData.player_id,
      team_id: teamId,
      player_reference: playerData.player_reference,
      first_name: nameInfo.firstName,
      last_name: nameInfo.lastName,
      first_name_en: nameInfo.firstNameEn,
      last_name_en: nameInfo.lastNameEn,
      position: playerData.position,
      country_code: null, // プレイヤー個別の国コードはAPIにない
      birth_date: birthDate,
      height_cm: heightCm,
      weight_kg: weightKg,
      full_name: playerData.full_name,
      abbr_name: playerData.abbr_name,
      full_name_kana: playerData.full_name_kana,
      abbr_name_kana: playerData.abbr_name_kana,
      full_name_en_all: playerData.full_name_en,
      abbr_name_en: playerData.abbr_name_en,
      primary_position: playerData.primary_position,
      jersey_number: playerData.jersey_number,
      birth_place: playerData.birth_place,
      college: playerData.college,
      high_school: playerData.high_school,
      image_url: playerData.image_url,
      profile_comment: null,
      profile_belonging_team: null,
      profile_career: null,
      profile_title: null,
      meta: null,
    };
  }

  /**
   * Save player from API data
   * @param {Object} playerData - API player data
   * @param {number} teamId - Team ID
   * @returns {Promise<Object>} Saved player
   */
  async savePlayerFromTeams(playerData, teamId) {
    const mappedData = this.mapPlayerDataFromTeams(playerData, teamId);
    return await this.savePlayer(mappedData);
  }
}

module.exports = Player;
