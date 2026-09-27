import { SHAPES } from '../constants/gameConfig';
import { countOccupiedCells, getValidPositions } from './boardLogic';

/**
 * Intelligent Block Generator for BLOCKBUSTERS
 * Uses weighted probabilities & board state analysis to ensure fun, balanced gameplay.
 */

export function generateSingleBlock(board = null, excludeLarge = false) {
  // Calculate board fullness ratio
  let occupancyRate = 0;
  if (board) {
    const occupied = countOccupiedCells(board);
    occupancyRate = occupied / 100;
  }

  // Adjust weights dynamically based on board state
  const weightedShapes = SHAPES.map(shape => {
    let weight = shape.baseWeight;

    // If board is > 65% full, boost small shapes and reduce large ones
    if (occupancyRate > 0.65) {
      if (shape.category === 'small') weight *= 2.2;
      if (shape.category === 'medium') weight *= 0.9;
      if (shape.category === 'large') weight *= 0.2;
    } else if (occupancyRate > 0.4) {
      if (shape.category === 'small') weight *= 1.3;
      if (shape.category === 'large') weight *= 0.7;
    }

    if (excludeLarge && shape.category === 'large') {
      weight = 0.5;
    }

    return { shape, weight };
  });

  // Calculate total weight
  const totalWeight = weightedShapes.reduce((acc, curr) => acc + curr.weight, 0);
  let random = Math.random() * totalWeight;

  let selectedShape = weightedShapes[0].shape;
  for (const item of weightedShapes) {
    if (random < item.weight) {
      selectedShape = item.shape;
      break;
    }
    random -= item.weight;
  }

  // Create an active block instance with unique instanceId
  return {
    ...selectedShape,
    instanceId: 'block_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
    rows: selectedShape.matrix.length,
    cols: selectedShape.matrix[0].length,
  };
}

/**
 * Generates 3 random blocks.
 * Guarantees that:
 * 1. At least 1-2 blocks can actually be placed on the current board (if the board isn't already dead).
 * 2. Does NOT spawn 3 huge blocks simultaneously (e.g. 3x3 + 5-bar + 5-bar).
 */
export function generateThreeBlocks(board) {
  const blocks = [];
  let largeCount = 0;

  for (let i = 0; i < 3; i++) {
    const excludeLarge = largeCount >= 1;
    let block = generateSingleBlock(board, excludeLarge);

    if (block.category === 'large') {
      largeCount++;
    }

    blocks.push(block);
  }

  // Sanity check: If all 3 blocks cannot fit on the board, try replacing one with a small dot or domino
  if (board) {
    const hasValidMove = blocks.some(b => getValidPositions(board, b).length > 0);
    if (!hasValidMove) {
      // Find single 1x1 dot or 1x2 domino to give player a fair recovery chance
      const smallDots = SHAPES.filter(s => s.id === 'dot_1x1' || s.id === 'line_1x2' || s.id === 'corner_tl');
      const rescueShape = smallDots[Math.floor(Math.random() * smallDots.length)];
      blocks[0] = {
        ...rescueShape,
        instanceId: 'rescue_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
        rows: rescueShape.matrix.length,
        cols: rescueShape.matrix[0].length,
      };
    }
  }

  return blocks;
}
