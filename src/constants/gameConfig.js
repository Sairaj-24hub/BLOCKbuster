/**
 * BLOCKBUSTERS - Game Configuration & Polyomino Shapes
 */

export const GAME_CONFIG = {
  BOARD_SIZE: 10,
  NUMBER_OF_AVAILABLE_BLOCKS: 3,

  // Mode settings
  MODES: {
    CLASSIC: {
      id: 'CLASSIC',
      title: 'Classic',
      subtitle: 'Strategic block placement. Beat your personal best.',
      icon: 'Trophy',
      hasTimer: false,
      badgeColor: '#6366f1',
    },
    TIME_ATTACK: {
      id: 'TIME_ATTACK',
      title: 'Time Attack',
      subtitle: 'Score as much as possible before time runs out.',
      icon: 'Flame',
      hasTimer: true,
      initialDuration: 90, // seconds
      bonusPerLine: [0, 2, 5, 9, 14], // bonus seconds awarded per simultaneous line clear
      badgeColor: '#f43f5e',
    },
    ENDLESS: {
      id: 'ENDLESS',
      title: 'Endless',
      subtitle: 'No timer. Relaxed puzzle solving at your own pace.',
      icon: 'Infinity',
      hasTimer: false,
      badgeColor: '#10b981',
    }
  },

  // Scoring configuration
  SCORING: {
    POINTS_PER_CELL: 10, // awarded immediately when block placed
    LINE_POINTS: {
      1: 100,
      2: 300,
      3: 650,
      4: 1100,
      5: 1800,
      6: 2700,
    },
    COMBO_MULTIPLIERS: [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0], // up to 5x max
    STREAK_BONUS_BASE: 50, // consecutive moves that result in a line clear
    PERFECT_CLEAR_BONUS: 2000, // clearing the entire board
  },

  // Visual & Animation timings (ms)
  ANIMATIONS: {
    LINE_HIGHLIGHT_MS: 160,
    LINE_CLEAR_MS: 320,
    PARTICLE_DURATION_MS: 700,
    SCORE_FLOAT_MS: 1000,
    SNAP_SPRING_MS: 180,
    SCREEN_SHAKE_MS: 280,
  },

  // Particle bursts
  PARTICLES: {
    COUNT_PER_CELL: 6,
    CUBE_SIZE_RANGE: [5, 11],
  },

  STORAGE_KEYS: {
    PROFILE: 'blockbusters_profile_v1',
    HIGH_SCORES: 'blockbusters_highscores_v1',
    SETTINGS: 'blockbusters_settings_v1',
    RECENT_GAMES: 'blockbusters_recent_v1',
  },
};

/**
 * Shape definitions with 3D color palettes and lighting hues
 */
export const SHAPES = [
  // 1. Single Dot (1x1)
  {
    id: 'dot_1x1',
    name: 'Single Cube',
    matrix: [[1]],
    category: 'small',
    baseWeight: 8,
    color: '#06b6d4', // Cyan
    glow: 'rgba(6, 182, 212, 0.45)',
    topColor: '#67e8f9',
    frontColor: '#0891b2',
    rightColor: '#0e7490',
  },

  // 2. 2-Line Horizontal (1x2)
  {
    id: 'line_1x2',
    name: '2-Bar H',
    matrix: [[1, 1]],
    category: 'small',
    baseWeight: 10,
    color: '#10b981', // Emerald
    glow: 'rgba(16, 185, 129, 0.45)',
    topColor: '#6ee7b7',
    frontColor: '#059669',
    rightColor: '#047857',
  },

  // 3. 2-Line Vertical (2x1)
  {
    id: 'line_2x1',
    name: '2-Bar V',
    matrix: [[1], [1]],
    category: 'small',
    baseWeight: 10,
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.45)',
    topColor: '#6ee7b7',
    frontColor: '#059669',
    rightColor: '#047857',
  },

  // 4. 3-Line Horizontal (1x3)
  {
    id: 'line_1x3',
    name: '3-Bar H',
    matrix: [[1, 1, 1]],
    category: 'medium',
    baseWeight: 11,
    color: '#84cc16', // Lime
    glow: 'rgba(132, 204, 22, 0.45)',
    topColor: '#bef264',
    frontColor: '#65a30d',
    rightColor: '#4d7c0f',
  },

  // 5. 3-Line Vertical (3x1)
  {
    id: 'line_3x1',
    name: '3-Bar V',
    matrix: [[1], [1], [1]],
    category: 'medium',
    baseWeight: 11,
    color: '#84cc16',
    glow: 'rgba(132, 204, 22, 0.45)',
    topColor: '#bef264',
    frontColor: '#65a30d',
    rightColor: '#4d7c0f',
  },

  // 6. 4-Line Horizontal (1x4)
  {
    id: 'line_1x4',
    name: '4-Bar H',
    matrix: [[1, 1, 1, 1]],
    category: 'medium',
    baseWeight: 8,
    color: '#eab308', // Amber
    glow: 'rgba(234, 179, 8, 0.45)',
    topColor: '#fde047',
    frontColor: '#ca8a04',
    rightColor: '#a16207',
  },

  // 7. 4-Line Vertical (4x1)
  {
    id: 'line_4x1',
    name: '4-Bar V',
    matrix: [[1], [1], [1], [1]],
    category: 'medium',
    baseWeight: 8,
    color: '#eab308',
    glow: 'rgba(234, 179, 8, 0.45)',
    topColor: '#fde047',
    frontColor: '#ca8a04',
    rightColor: '#a16207',
  },

  // 8. 5-Line Horizontal (1x5)
  {
    id: 'line_1x5',
    name: '5-Bar H',
    matrix: [[1, 1, 1, 1, 1]],
    category: 'large',
    baseWeight: 5,
    color: '#f97316', // Orange
    glow: 'rgba(249, 115, 22, 0.45)',
    topColor: '#fdba74',
    frontColor: '#ea580c',
    rightColor: '#c2410c',
  },

  // 9. 5-Line Vertical (5x1)
  {
    id: 'line_5x1',
    name: '5-Bar V',
    matrix: [[1], [1], [1], [1], [1]],
    category: 'large',
    baseWeight: 5,
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.45)',
    topColor: '#fdba74',
    frontColor: '#ea580c',
    rightColor: '#c2410c',
  },

  // 10. 2x2 Square
  {
    id: 'square_2x2',
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1]
    ],
    category: 'medium',
    baseWeight: 12,
    color: '#3b82f6', // Blue
    glow: 'rgba(59, 130, 246, 0.45)',
    topColor: '#93c5fd',
    frontColor: '#2563eb',
    rightColor: '#1d4ed8',
  },

  // 11. 3x3 Square
  {
    id: 'square_3x3',
    name: 'Square 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1]
    ],
    category: 'large',
    baseWeight: 4,
    color: '#a855f7', // Purple
    glow: 'rgba(168, 85, 247, 0.45)',
    topColor: '#d8b4fe',
    frontColor: '#9333ea',
    rightColor: '#7e22ce',
  },

  // 12. Corner 2x2 (3 cells) - 4 orientations
  {
    id: 'corner_tl',
    name: 'Corner TL',
    matrix: [
      [1, 1],
      [1, 0]
    ],
    category: 'small',
    baseWeight: 9,
    color: '#0284c7', // Sky
    glow: 'rgba(2, 132, 199, 0.45)',
    topColor: '#7dd3fc',
    frontColor: '#0369a1',
    rightColor: '#075985',
  },
  {
    id: 'corner_tr',
    name: 'Corner TR',
    matrix: [
      [1, 1],
      [0, 1]
    ],
    category: 'small',
    baseWeight: 9,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    topColor: '#7dd3fc',
    frontColor: '#0369a1',
    rightColor: '#075985',
  },
  {
    id: 'corner_bl',
    name: 'Corner BL',
    matrix: [
      [1, 0],
      [1, 1]
    ],
    category: 'small',
    baseWeight: 9,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    topColor: '#7dd3fc',
    frontColor: '#0369a1',
    rightColor: '#075985',
  },
  {
    id: 'corner_br',
    name: 'Corner BR',
    matrix: [
      [0, 1],
      [1, 1]
    ],
    category: 'small',
    baseWeight: 9,
    color: '#0284c7',
    glow: 'rgba(2, 132, 199, 0.45)',
    topColor: '#7dd3fc',
    frontColor: '#0369a1',
    rightColor: '#075985',
  },

  // 13. L-Shapes (3x2 and 2x3 - 4 cells) - 4 rotations
  {
    id: 'L_up_left',
    name: 'L-Shape 1',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#ec4899', // Pink
    glow: 'rgba(236, 72, 153, 0.45)',
    topColor: '#f472b6',
    frontColor: '#db2777',
    rightColor: '#be185d',
  },
  {
    id: 'L_up_right',
    name: 'L-Shape 2',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    topColor: '#f472b6',
    frontColor: '#db2777',
    rightColor: '#be185d',
  },
  {
    id: 'L_h_left',
    name: 'L-Shape 3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    topColor: '#f472b6',
    frontColor: '#db2777',
    rightColor: '#be185d',
  },
  {
    id: 'L_h_right',
    name: 'L-Shape 4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.45)',
    topColor: '#f472b6',
    frontColor: '#db2777',
    rightColor: '#be185d',
  },

  // 14. Big Corner (3x3 - 5 cells)
  {
    id: 'big_corner_bl',
    name: 'Big Corner',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1]
    ],
    category: 'large',
    baseWeight: 4,
    color: '#f43f5e', // Rose
    glow: 'rgba(244, 63, 94, 0.45)',
    topColor: '#fb7185',
    frontColor: '#e11d48',
    rightColor: '#be123c',
  },
  {
    id: 'big_corner_br',
    name: 'Big Corner BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1]
    ],
    category: 'large',
    baseWeight: 4,
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.45)',
    topColor: '#fb7185',
    frontColor: '#e11d48',
    rightColor: '#be123c',
  },

  // 15. T-Shapes (4 cells)
  {
    id: 'T_down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#6366f1', // Indigo
    glow: 'rgba(99, 102, 241, 0.45)',
    topColor: '#a5b4fc',
    frontColor: '#4f46e5',
    rightColor: '#4338ca',
  },
  {
    id: 'T_up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    category: 'medium',
    baseWeight: 7,
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.45)',
    topColor: '#a5b4fc',
    frontColor: '#4f46e5',
    rightColor: '#4338ca',
  },

  // 16. Z/S Zigzags (4 cells)
  {
    id: 'Z_h',
    name: 'Z-Shape H',
    matrix: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    category: 'medium',
    baseWeight: 6,
    color: '#14b8a6', // Teal
    glow: 'rgba(20, 184, 166, 0.45)',
    topColor: '#5eead4',
    frontColor: '#0d9488',
    rightColor: '#0f766e',
  },
  {
    id: 'S_h',
    name: 'S-Shape H',
    matrix: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    category: 'medium',
    baseWeight: 6,
    color: '#14b8a6',
    glow: 'rgba(20, 184, 166, 0.45)',
    topColor: '#5eead4',
    frontColor: '#0d9488',
    rightColor: '#0f766e',
  },

  // 17. Plus / Cross shape
  {
    id: 'cross_3x3',
    name: 'Plus Shape',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    category: 'large',
    baseWeight: 3,
    color: '#e11d48', // Crimson Red
    glow: 'rgba(225, 29, 72, 0.45)',
    topColor: '#f43f5e',
    frontColor: '#be123c',
    rightColor: '#9f1239',
  }
];
