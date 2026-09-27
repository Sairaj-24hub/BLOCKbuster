import { GAME_CONFIG, SHAPES } from '../constants/gameConfig';

/**
 * Creates an empty 10x10 matrix initialized with null
 */
export function createEmptyBoard() {
  const size = GAME_CONFIG.BOARD_SIZE;
  const board = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
}

/**
 * Creates a pre-seeded challenging board with strategic obstacle blocks.
 * Prevents boring empty starts, introduces immediate puzzle-solving tension.
 *
 * Density levels:
 * 'LIGHT': 8 - 12 scattered blocks
 * 'MEDIUM': 14 - 18 scattered blocks (Default)
 * 'HARDCORE': 20 - 26 scattered blocks
 */
export function createSeededBoard(density = 'MEDIUM') {
  const board = createEmptyBoard();
  const size = GAME_CONFIG.BOARD_SIZE;

  let targetCount = 16;
  if (density === 'LIGHT') targetCount = 10;
  if (density === 'HARDCORE') targetCount = 22;
  if (density === 'NONE') return board;

  const colorPalette = [
    { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.45)', topColor: '#67e8f9', frontColor: '#0891b2', rightColor: '#0e7490' },
    { color: '#10b981', glow: 'rgba(16, 185, 129, 0.45)', topColor: '#6ee7b7', frontColor: '#059669', rightColor: '#047857' },
    { color: '#84cc16', glow: 'rgba(132, 204, 22, 0.45)', topColor: '#bef264', frontColor: '#65a30d', rightColor: '#4d7c0f' },
    { color: '#eab308', glow: 'rgba(234, 179, 8, 0.45)', topColor: '#fde047', frontColor: '#ca8a04', rightColor: '#a16207' },
    { color: '#f97316', glow: 'rgba(249, 115, 22, 0.45)', topColor: '#fdba74', frontColor: '#ea580c', rightColor: '#c2410c' },
    { color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.45)', topColor: '#93c5fd', frontColor: '#2563eb', rightColor: '#1d4ed8' },
    { color: '#a855f7', glow: 'rgba(168, 85, 247, 0.45)', topColor: '#d8b4fe', frontColor: '#9333ea', rightColor: '#7e22ce' },
    { color: '#ec4899', glow: 'rgba(236, 72, 153, 0.45)', topColor: '#f472b6', frontColor: '#db2777', rightColor: '#be185d' },
  ];

  // Distribute scattered clusters across board
  // We cap max occupied cells per row and col to 5 (out of 10) so rows/cols are never full initially
  const rowCounts = new Array(size).fill(0);
  const colCounts = new Array(size).fill(0);

  let placed = 0;
  let attempts = 0;

  while (placed < targetCount && attempts < 150) {
    attempts++;
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);

    // Keep center or corners interesting while maintaining at least 5 empty cells per line
    if (board[r][c] === null && rowCounts[r] < 5 && colCounts[c] < 5) {
      const colScheme = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      board[r][c] = {
        color: colScheme.color,
        glow: colScheme.glow,
        topColor: colScheme.topColor,
        frontColor: colScheme.frontColor,
        rightColor: colScheme.rightColor,
        shapeId: 'starter_block',
        placedAt: Date.now(),
      };
      rowCounts[r]++;
      colCounts[c]++;
      placed++;
    }
  }

  return board;
}

/**
 * Checks if a block can be legally placed at (startRow, startCol)
 */
export function canPlaceBlock(board, block, startRow, startCol) {
  if (!board || !block || !block.matrix) return false;
  const boardSize = GAME_CONFIG.BOARD_SIZE;
  const matrix = block.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Boundary check
  if (startRow < 0 || startCol < 0 || startRow + rows > boardSize || startCol + cols > boardSize) {
    return false;
  }

  // Cell collision check
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        const boardR = startRow + r;
        const boardC = startCol + c;
        if (board[boardR][boardC] !== null) {
          return false; // occupied cell
        }
      }
    }
  }

  return true;
}

/**
 * Finds all valid [r, c] starting positions on the board for a given block
 */
export function getValidPositions(board, block) {
  if (!board || !block) return [];
  const valid = [];
  const boardSize = GAME_CONFIG.BOARD_SIZE;
  const rows = block.matrix.length;
  const cols = block.matrix[0].length;

  for (let r = 0; r <= boardSize - rows; r++) {
    for (let c = 0; c <= boardSize - cols; c++) {
      if (canPlaceBlock(board, block, r, c)) {
        valid.push({ row: r, col: c });
      }
    }
  }

  return valid;
}

/**
 * Places a block on the board and returns a new deep copy of the board
 */
export function placeBlock(board, block, startRow, startCol) {
  const newBoard = board.map(row => [...row]);
  const matrix = block.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === 1) {
        newBoard[startRow + r][startCol + c] = {
          color: block.color,
          glow: block.glow,
          topColor: block.topColor,
          frontColor: block.frontColor,
          rightColor: block.rightColor,
          shapeId: block.id,
          placedAt: Date.now(),
        };
      }
    }
  }

  return newBoard;
}

/**
 * Identifies completed horizontal rows and vertical columns
 */
export function findCompletedLines(board) {
  const size = GAME_CONFIG.BOARD_SIZE;
  const completedRows = [];
  const completedCols = [];

  // Check horizontal rows
  for (let r = 0; r < size; r++) {
    let isComplete = true;
    for (let c = 0; c < size; c++) {
      if (board[r][c] === null) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completedRows.push(r);
    }
  }

  // Check vertical columns
  for (let c = 0; c < size; c++) {
    let isComplete = true;
    for (let r = 0; r < size; r++) {
      if (board[r][c] === null) {
        isComplete = false;
        break;
      }
    }
    if (isComplete) {
      completedCols.push(c);
    }
  }

  return {
    rows: completedRows,
    cols: completedCols,
    totalLines: completedRows.length + completedCols.length,
  };
}

/**
 * Clears the specified rows and columns from the board
 */
export function clearLines(board, rows, cols) {
  const size = GAME_CONFIG.BOARD_SIZE;
  const newBoard = board.map(row => [...row]);

  rows.forEach(r => {
    for (let c = 0; c < size; c++) {
      newBoard[r][c] = null;
    }
  });

  cols.forEach(c => {
    for (let r = 0; r < size; r++) {
      newBoard[r][c] = null;
    }
  });

  return newBoard;
}

/**
 * Checks if ANY of the currently available blocks can be placed anywhere on the board
 */
export function canAnyBlockFit(board, availableBlocks) {
  if (!availableBlocks || availableBlocks.length === 0) return false;

  for (const block of availableBlocks) {
    if (!block) continue; // already used block in tray
    const validPositions = getValidPositions(board, block);
    if (validPositions.length > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Counts total occupied cells on the board
 */
export function countOccupiedCells(board) {
  let count = 0;
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] !== null) count++;
    }
  }
  return count;
}

/**
 * Counts the number of active cells in a block shape matrix
 */
export function countBlockCells(block) {
  if (!block || !block.matrix) return 0;
  return block.matrix.flat().filter(cell => cell === 1).length;
}

/**
 * Calculates score for block placement and line clears
 */
export function calculateScoreBreakdown(blockCells, totalLines, comboStreak) {
  const placementPoints = blockCells * GAME_CONFIG.SCORING.POINTS_PER_CELL;
  
  if (totalLines === 0) {
    return {
      placementPoints,
      linePoints: 0,
      comboMultiplier: 1.0,
      streakBonus: 0,
      totalEarned: placementPoints,
    };
  }

  const baseLinePoints = GAME_CONFIG.SCORING.LINE_POINTS[totalLines] || (totalLines * 400);
  const multiplierIndex = Math.min(comboStreak, GAME_CONFIG.SCORING.COMBO_MULTIPLIERS.length - 1);
  const comboMultiplier = GAME_CONFIG.SCORING.COMBO_MULTIPLIERS[multiplierIndex];
  const streakBonus = comboStreak > 1 ? (comboStreak - 1) * GAME_CONFIG.SCORING.STREAK_BONUS_BASE : 0;

  const totalEarned = placementPoints + Math.round(baseLinePoints * comboMultiplier) + streakBonus;

  return {
    placementPoints,
    linePoints: baseLinePoints,
    comboMultiplier,
    streakBonus,
    totalEarned,
  };
}
