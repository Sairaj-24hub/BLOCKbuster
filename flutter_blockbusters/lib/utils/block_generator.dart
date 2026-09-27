import 'dart:math';
import '../models/block_shape.dart';
import '../models/placed_cell.dart';
import 'board_logic.dart';

class BlockGenerator {
  static final _rand = Random();

  static BlockShape generateSingleBlock(
    List<List<PlacedCell?>>? board, {
    bool excludeLarge = false,
  }) {
    double occupancyRate = 0.0;
    if (board != null) {
      final occupied = BoardLogic.countOccupiedCells(board);
      occupancyRate = occupied / 100.0;
    }

    final weightedList = <MapEntry<BlockShape, double>>[];

    for (final shape in kAllShapes) {
      double weight = shape.baseWeight;

      if (occupancyRate > 0.65) {
        if (shape.category == ShapeCategory.small) weight *= 2.2;
        if (shape.category == ShapeCategory.medium) weight *= 0.9;
        if (shape.category == ShapeCategory.large) weight *= 0.2;
      } else if (occupancyRate > 0.4) {
        if (shape.category == ShapeCategory.small) weight *= 1.3;
        if (shape.category == ShapeCategory.large) weight *= 0.7;
      }

      if (excludeLarge && shape.category == ShapeCategory.large) {
        weight = 0.5;
      }

      weightedList.add(MapEntry(shape, weight));
    }

    final totalWeight = weightedList.fold<double>(0.0, (acc, item) => acc + item.value);
    double randomVal = _rand.nextDouble() * totalWeight;

    BlockShape selected = weightedList.first.key;
    for (final item in weightedList) {
      if (randomVal < item.value) {
        selected = item.key;
        break;
      }
      randomVal -= item.value;
    }

    final instanceId = 'block_${_rand.nextInt(999999)}_${DateTime.now().millisecondsSinceEpoch}';
    return selected.copyWithInstanceId(instanceId);
  }

  static List<BlockShape> generateThreeBlocks(List<List<PlacedCell?>>? board) {
    final blocks = <BlockShape>[];
    int largeCount = 0;

    for (var i = 0; i < 3; i++) {
      final excludeLarge = largeCount >= 1;
      final block = generateSingleBlock(board, excludeLarge: excludeLarge);

      if (block.category == ShapeCategory.large) {
        largeCount++;
      }
      blocks.add(block);
    }

    // Safety check: ensure at least one block can be placed
    if (board != null) {
      final hasValid = blocks.any((b) => BoardLogic.getValidPositions(board, b).isNotEmpty);
      if (!hasValid) {
        final smallDots = kAllShapes.where((s) => s.id == 'dot_1x1' || s.id == 'line_1x2' || s.id == 'corner_tl').toList();
        final rescue = smallDots[_rand.nextInt(smallDots.length)];
        blocks[0] = rescue.copyWithInstanceId('rescue_${_rand.nextInt(999999)}_${DateTime.now().millisecondsSinceEpoch}');
      }
    }

    return blocks;
  }
}
