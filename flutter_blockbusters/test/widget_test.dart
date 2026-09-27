import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_blockbusters/constants/game_config.dart';
import 'package:flutter_blockbusters/utils/board_logic.dart';

void main() {
  test('Board logic basic test', () {
    final board = BoardLogic.createEmptyBoard();
    expect(board.length, GameConfig.boardSize);
  });
}
