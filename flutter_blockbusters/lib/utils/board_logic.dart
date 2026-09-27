import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/game_config.dart';
import '../models/block_shape.dart';
import '../models/placed_cell.dart';

class CompletedLines {
  final List<int> rows;
  final List<int> cols;
  int get totalLines => rows.length + cols.length;

  const CompletedLines({required this.rows, required this.cols});
}

class ScoreResult {
  final int totalGain;
  final int placementPoints;
  final int linePoints;
  final int streakBonus;
  final int perfectClearBonus;
  final double multiplier;
  final int newStreak;

  const ScoreResult({
    required this.totalGain,
    required this.placementPoints,
    required this.linePoints,
    required this.streakBonus,
    required this.perfectClearBonus,
    required this.multiplier,
    required this.newStreak,
  });
}

class BoardLogic {
  static List<List<PlacedCell?>> createEmptyBoard() {
    return List.generate(
      GameConfig.boardSize,
      (_) => List<PlacedCell?>.filled(GameConfig.boardSize, null, growable: false),
      growable: false,
    );
  }

  static List<List<PlacedCell?>> createSeededBoard(String density) {
    final board = List.generate(
      GameConfig.boardSize,
      (_) => List<PlacedCell?>.filled(GameConfig.boardSize, null, growable: true),
      growable: true,
    );

    if (density == 'NONE') return board;

    int targetCount = 16;
    if (density == 'LIGHT') targetCount = 10;
    if (density == 'HARDCORE') targetCount = 22;

    final colorPalette = [
      const PlacedCell(
        color: Color(0xFF06B6D4),
        glow: Color(0x7306B6D4),
        topColor: Color(0xFF67E8F9),
        frontColor: Color(0xFF0891B2),
        rightColor: Color(0xFF0E7490),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFF10B981),
        glow: Color(0x7310B981),
        topColor: Color(0xFF6EE7B7),
        frontColor: Color(0xFF059669),
        rightColor: Color(0xFF047857),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFF84CC16),
        glow: Color(0x7384CC16),
        topColor: Color(0xFFBEF264),
        frontColor: Color(0xFF65A30D),
        rightColor: Color(0xFF4D7C0F),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFFEAB308),
        glow: Color(0x73EAB308),
        topColor: Color(0xFFFDE047),
        frontColor: Color(0xFFCA8A04),
        rightColor: Color(0xFFA16207),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFFF97316),
        glow: Color(0x73F97316),
        topColor: Color(0xFFFDBA74),
        frontColor: Color(0xFFEA580C),
        rightColor: Color(0xFFC2410C),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFF3B82F6),
        glow: Color(0x733B82F6),
        topColor: Color(0xFF93C5FD),
        frontColor: Color(0xFF2563EB),
        rightColor: Color(0xFF1D4ED8),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFFA855F7),
        glow: Color(0x73A855F7),
        topColor: Color(0xFFD8B4FE),
        frontColor: Color(0xFF9333EA),
        rightColor: Color(0xFF7E22CE),
        shapeId: 'starter',
        placedAt: 0,
      ),
      const PlacedCell(
        color: Color(0xFFEC4899),
        glow: Color(0x73EC4899),
        topColor: Color(0xFFF472B6),
        frontColor: Color(0xFFDB2777),
        rightColor: Color(0xFFBE185D),
        shapeId: 'starter',
        placedAt: 0,
      ),
    ];

    final rand = Random();
    final rowCounts = List<int>.filled(GameConfig.boardSize, 0);
    final colCounts = List<int>.filled(GameConfig.boardSize, 0);

    int placed = 0;
    int attempts = 0;

    while (placed < targetCount && attempts < 150) {
      attempts++;
      final r = rand.nextInt(GameConfig.boardSize);
      final c = rand.nextInt(GameConfig.boardSize);

      if (board[r][c] == null && rowCounts[r] < 5 && colCounts[c] < 5) {
        final sample = colorPalette[rand.nextInt(colorPalette.length)];
        board[r][c] = PlacedCell(
          color: sample.color,
          glow: sample.glow,
          topColor: sample.topColor,
          frontColor: sample.frontColor,
          rightColor: sample.rightColor,
          shapeId: 'starter_block',
          placedAt: DateTime.now().millisecondsSinceEpoch,
        );
        rowCounts[r]++;
        colCounts[c]++;
        placed++;
      }
    }

    return board;
  }

  static bool canPlaceBlock(
    List<List<PlacedCell?>> board,
    BlockShape block,
    int startRow,
    int startCol,
  ) {
    final rows = block.rows;
    final cols = block.cols;

    if (startRow < 0 || startCol < 0 || startRow + rows > GameConfig.boardSize || startCol + cols > GameConfig.boardSize) {
      return false;
    }

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (block.matrix[r][c] == 1) {
          if (board[startRow + r][startCol + c] != null) {
            return false;
          }
        }
      }
    }

    return true;
  }

  static List<Point<int>> getValidPositions(
    List<List<PlacedCell?>> board,
    BlockShape block,
  ) {
    final valid = <Point<int>>[];
    final rows = block.rows;
    final cols = block.cols;

    for (var r = 0; r <= GameConfig.boardSize - rows; r++) {
      for (var c = 0; c <= GameConfig.boardSize - cols; c++) {
        if (canPlaceBlock(board, block, r, c)) {
          valid.add(Point<int>(r, c));
        }
      }
    }

    return valid;
  }

  static List<List<PlacedCell?>> placeBlock(
    List<List<PlacedCell?>> board,
    BlockShape block,
    int startRow,
    int startCol,
  ) {
    final newBoard = board.map((row) => List<PlacedCell?>.from(row)).toList();
    final now = DateTime.now().millisecondsSinceEpoch;

    for (var r = 0; r < block.rows; r++) {
      for (var c = 0; c < block.cols; c++) {
        if (block.matrix[r][c] == 1) {
          newBoard[startRow + r][startCol + c] = PlacedCell(
            color: block.color,
            topColor: block.topColor,
            frontColor: block.frontColor,
            rightColor: block.rightColor,
            glow: block.glow,
            shapeId: block.id,
            placedAt: now,
          );
        }
      }
    }

    return newBoard;
  }

  static CompletedLines findCompletedLines(List<List<PlacedCell?>> board) {
    final completedRows = <int>[];
    final completedCols = <int>[];

    // Rows
    for (var r = 0; r < GameConfig.boardSize; r++) {
      bool full = true;
      for (var c = 0; c < GameConfig.boardSize; c++) {
        if (board[r][c] == null) {
          full = false;
          break;
        }
      }
      if (full) completedRows.add(r);
    }

    // Columns
    for (var c = 0; c < GameConfig.boardSize; c++) {
      bool full = true;
      for (var r = 0; r < GameConfig.boardSize; r++) {
        if (board[r][c] == null) {
          full = false;
          break;
        }
      }
      if (full) completedCols.add(c);
    }

    return CompletedLines(rows: completedRows, cols: completedCols);
  }

  static List<List<PlacedCell?>> clearLines(
    List<List<PlacedCell?>> board,
    List<int> rows,
    List<int> cols,
  ) {
    final newBoard = board.map((row) => List<PlacedCell?>.from(row)).toList();

    for (final r in rows) {
      for (var c = 0; c < GameConfig.boardSize; c++) {
        newBoard[r][c] = null;
      }
    }

    for (final c in cols) {
      for (var r = 0; r < GameConfig.boardSize; r++) {
        newBoard[r][c] = null;
      }
    }

    return newBoard;
  }

  static bool canAnyBlockFit(
    List<List<PlacedCell?>> board,
    List<BlockShape?> availableBlocks,
  ) {
    for (final block in availableBlocks) {
      if (block != null) {
        if (getValidPositions(board, block).isNotEmpty) {
          return true;
        }
      }
    }
    return false;
  }

  static int countOccupiedCells(List<List<PlacedCell?>> board) {
    int count = 0;
    for (var r = 0; r < GameConfig.boardSize; r++) {
      for (var c = 0; c < GameConfig.boardSize; c++) {
        if (board[r][c] != null) count++;
      }
    }
    return count;
  }

  static bool isBoardCompletelyEmpty(List<List<PlacedCell?>> board) {
    for (var r = 0; r < GameConfig.boardSize; r++) {
      for (var c = 0; c < GameConfig.boardSize; c++) {
        if (board[r][c] != null) return false;
      }
    }
    return true;
  }

  static ScoreResult calculateScoreBreakdown({
    required BlockShape block,
    required int linesCount,
    required int currentStreak,
    required bool isBoardCleared,
  }) {
    final placementPoints = block.cellCount * GameConfig.pointsPerCell;
    int baseLinePoints = 0;
    int streakBonus = 0;
    int perfectClearBonus = 0;
    double multiplier = 1.0;
    int newStreak = currentStreak;

    if (linesCount > 0) {
      newStreak += 1;
      baseLinePoints = GameConfig.linePoints[linesCount] ?? (linesCount * 500);

      final multiplierIndex = min(newStreak - 1, GameConfig.comboMultipliers.length - 1);
      multiplier = GameConfig.comboMultipliers[max(0, multiplierIndex)];

      streakBonus = (newStreak > 1) ? (newStreak * GameConfig.streakBonusBase) : 0;

      if (isBoardCleared) {
        perfectClearBonus = GameConfig.perfectClearBonus;
      }
    } else {
      newStreak = 0;
    }

    final totalLineScore = ((baseLinePoints + streakBonus) * multiplier).round();
    final totalGain = placementPoints + totalLineScore + perfectClearBonus;

    return ScoreResult(
      totalGain: totalGain,
      placementPoints: placementPoints,
      linePoints: totalLineScore,
      streakBonus: streakBonus,
      perfectClearBonus: perfectClearBonus,
      multiplier: multiplier,
      newStreak: newStreak,
    );
  }
}
