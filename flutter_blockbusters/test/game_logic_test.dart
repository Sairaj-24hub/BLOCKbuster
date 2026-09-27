import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_blockbusters/constants/game_config.dart';
import 'package:flutter_blockbusters/models/block_shape.dart';
import 'package:flutter_blockbusters/models/placed_cell.dart';
import 'package:flutter_blockbusters/utils/board_logic.dart';
import 'package:flutter_blockbusters/utils/block_generator.dart';

void main() {
  group('BoardLogic Tests', () {
    test('createEmptyBoard produces a 10x10 matrix with null values', () {
      final board = BoardLogic.createEmptyBoard();
      expect(board.length, GameConfig.boardSize);
      expect(board[0].length, GameConfig.boardSize);
      expect(board.every((row) => row.every((c) => c == null)), isTrue);
    });

    test('canPlaceBlock accurately validates placement bounds and occupied cells', () {
      final board = BoardLogic.createEmptyBoard();
      final dot = kAllShapes.firstWhere((s) => s.id == 'dot_1x1');

      expect(BoardLogic.canPlaceBlock(board, dot, 0, 0), isTrue);
      expect(BoardLogic.canPlaceBlock(board, dot, 9, 9), isTrue);
      expect(BoardLogic.canPlaceBlock(board, dot, 10, 0), isFalse);
      expect(BoardLogic.canPlaceBlock(board, dot, -1, 0), isFalse);

      final square = kAllShapes.firstWhere((s) => s.id == 'square_2x2');
      expect(BoardLogic.canPlaceBlock(board, square, 8, 8), isTrue);
      expect(BoardLogic.canPlaceBlock(board, square, 9, 9), isFalse); // out of bounds
    });

    test('placeBlock and findCompletedLines detect full lines properly', () {
      var board = BoardLogic.createEmptyBoard();
      final line5 = kAllShapes.firstWhere((s) => s.id == 'line_1x5');

      // Fill first row with two 1x5 horizontal bars
      board = BoardLogic.placeBlock(board, line5, 0, 0);
      board = BoardLogic.placeBlock(board, line5, 0, 5);

      final completed = BoardLogic.findCompletedLines(board);
      expect(completed.rows, contains(0));
      expect(completed.cols.isEmpty, isTrue);
      expect(completed.totalLines, 1);

      final clearedBoard = BoardLogic.clearLines(board, completed.rows, completed.cols);
      expect(clearedBoard[0].every((c) => c == null), isTrue);
    });

    test('BlockGenerator produces valid shapes without crashing', () {
      final board = BoardLogic.createEmptyBoard();
      final blocks = BlockGenerator.generateThreeBlocks(board);

      expect(blocks.length, 3);
      expect(blocks.every((b) => b.matrix.isNotEmpty), isTrue);
    });
  });
}
