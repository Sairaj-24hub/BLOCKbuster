import { GAME_CONFIG } from '../constants/gameConfig';

const PROFILE_KEY = GAME_CONFIG.STORAGE_KEYS.PROFILE;
const SCORES_KEY = GAME_CONFIG.STORAGE_KEYS.HIGH_SCORES;
const SETTINGS_KEY = GAME_CONFIG.STORAGE_KEYS.SETTINGS;
const RECENT_KEY = GAME_CONFIG.STORAGE_KEYS.RECENT_GAMES;

// Initial simulated online leaderboard seeds
const INITIAL_ONLINE_SEEDS = {
  CLASSIC: [
    { username: 'NeoMatrix', score: 32450, lines: 48, combo: 6, date: 'Today' },
    { username: 'VortexGamer', score: 28900, lines: 42, combo: 5, date: 'Today' },
    { username: 'CyberPixel', score: 24650, lines: 36, combo: 5, date: 'Yesterday' },
    { username: 'QuantumGrid', score: 21800, lines: 31, combo: 4, date: '2 days ago' },
    { username: 'ArcadeMaster', score: 18400, lines: 27, combo: 4, date: '3 days ago' },
    { username: 'PulseRider', score: 15200, lines: 22, combo: 3, date: '4 days ago' },
  ],
  TIME_ATTACK: [
    { username: 'SpeedDemon', score: 27800, lines: 44, combo: 7, date: 'Today' },
    { username: 'ChronoShift', score: 23400, lines: 38, combo: 5, date: 'Today' },
    { username: 'TurboBlock', score: 19850, lines: 31, combo: 4, date: 'Yesterday' },
    { username: 'FlashGrid', score: 16700, lines: 25, combo: 4, date: '2 days ago' },
    { username: 'SonicSolver', score: 13900, lines: 20, combo: 3, date: '3 days ago' },
  ],
  ENDLESS: [
    { username: 'ZenMaster', score: 48600, lines: 72, combo: 8, date: 'Today' },
    { username: 'InfinityLoop', score: 39500, lines: 58, combo: 6, date: 'Yesterday' },
    { username: 'BlockBuster99', score: 34200, lines: 51, combo: 5, date: '2 days ago' },
    { username: 'CosmicVoyager', score: 29800, lines: 45, combo: 5, date: '3 days ago' },
    { username: 'DreamCatcher', score: 22100, lines: 33, combo: 4, date: '5 days ago' },
  ],
};

/**
 * Get or initialize Player Profile
 */
export function getProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Storage error in getProfile', e);
  }
  return null;
}

export function saveProfile(username, avatar = '👾') {
  try {
    const profile = {
      username: username.trim() || 'Player 1',
      avatar,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile;
  } catch (e) {
    console.error('Failed to save profile', e);
    return { username: 'Player 1', avatar: '👾' };
  }
}

/**
 * Get Best High Scores per mode
 */
export function getHighScores() {
  try {
    const data = localStorage.getItem(SCORES_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Storage error in getHighScores', e);
  }
  return {
    CLASSIC: 0,
    TIME_ATTACK: 0,
    ENDLESS: 0,
  };
}

/**
 * Save new high score if beaten, and record game log
 */
export function recordGameResult(gameResult) {
  const { mode, score, linesCleared, highestCombo, blocksPlaced, username } = gameResult;
  
  try {
    // 1. Update best scores
    const scores = getHighScores();
    const prevBest = scores[mode] || 0;
    const isNewHigh = score > prevBest;
    if (isNewHigh) {
      scores[mode] = score;
      localStorage.setItem(SCORES_KEY, JSON.stringify(scores));
    }

    // 2. Append to recent history
    let recents = [];
    const savedRecents = localStorage.getItem(RECENT_KEY);
    if (savedRecents) {
      recents = JSON.parse(savedRecents);
    }

    const newEntry = {
      id: 'game_' + Date.now(),
      username: username || 'Player',
      mode,
      score,
      linesCleared,
      highestCombo,
      blocksPlaced,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString(),
    };

    recents.unshift(newEntry);
    if (recents.length > 50) recents.pop();
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents));

    return { isNewHigh, prevBest, newBest: scores[mode] };
  } catch (e) {
    console.warn('Error recording game result', e);
    return { isNewHigh: false, prevBest: 0, newBest: score };
  }
}

/**
 * Retrieve merged Leaderboard entries
 */
export function getLeaderboard(mode = 'CLASSIC', timeFilter = 'ALL_TIME') {
  try {
    const seedList = INITIAL_ONLINE_SEEDS[mode] || [];
    let recents = [];
    const savedRecents = localStorage.getItem(RECENT_KEY);
    if (savedRecents) {
      recents = JSON.parse(savedRecents).filter(g => g.mode === mode);
    }

    // Filter by Today if requested
    const todayStr = new Date().toLocaleDateString();
    let combined = [
      ...recents.map(r => ({
        id: r.id,
        username: r.username,
        score: r.score,
        lines: r.linesCleared,
        combo: r.highestCombo,
        date: r.dateStr === todayStr ? 'Today' : r.dateStr,
        isLocalPlayer: true,
      })),
      ...seedList.map((s, idx) => ({
        id: `seed_${mode}_${idx}`,
        username: s.username,
        score: s.score,
        lines: s.lines,
        combo: s.combo,
        date: s.date,
        isLocalPlayer: false,
      })),
    ];

    if (timeFilter === 'TODAY') {
      combined = combined.filter(entry => entry.date === 'Today');
    }

    // Sort descending by score
    combined.sort((a, b) => b.score - a.score);

    // Assign rank 1..N
    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  } catch (e) {
    console.warn('Error fetching leaderboard', e);
    return [];
  }
}

/**
 * Get & Save Settings
 */
export function getSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('Storage error in getSettings', e);
  }
  return {
    sfxEnabled: true,
    bgmEnabled: true,
    haptics: true,
    particlesEnabled: true,
    perspective3D: true,
    starterObstacles: 'MEDIUM', // 'LIGHT' | 'MEDIUM' | 'HARDCORE' | 'NONE'
    enableCursorTrail: true,
    enableBgVideo: true,
    enableFallingParticles: true,
    boardTheme: 'dark-neon',
  };
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Error saving settings', e);
  }
}

/**
 * Reset all local storage data
 */
export function resetAllData() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(SCORES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(RECENT_KEY);
    return true;
  } catch (e) {
    console.warn('Error clearing data', e);
    return false;
  }
}
