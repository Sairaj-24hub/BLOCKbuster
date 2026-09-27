import 'package:flutter/material.dart';
import '../models/block_shape.dart';
import '../utils/board_logic.dart';
import '../viewmodels/game_viewmodel.dart';
import 'block_cube_widget.dart';
import 'game_board_widget.dart';

class BlockTrayWidget extends StatelessWidget {
  final GameViewModel vm;

  const BlockTrayWidget({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A).withValues(alpha: 0.8),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: const Color(0xFF38BDF8).withValues(alpha: 0.2),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: List.generate(3, (index) {
          final block = vm.availableBlocks[index];
          if (block == null) {
            return const Expanded(
              child: SizedBox(
                height: 100,
                child: Center(
                  child: Icon(
                    Icons.check_circle_outline_rounded,
                    color: Color(0xFF334155),
                    size: 28,
                  ),
                ),
              ),
            );
          }

          final canFit = BoardLogic.getValidPositions(vm.board, block).isNotEmpty;

          return Expanded(
            child: Center(
              child: _DraggableBlock(
                block: block,
                index: index,
                canFit: canFit,
                onDragStarted: () => vm.setDraggingBlock(block),
                onDragEnd: () {
                  vm.setDraggingBlock(null);
                  vm.clearGhostPosition();
                },
              ),
            ),
          );
        }),
      ),
    );
  }
}

class _DraggableBlock extends StatelessWidget {
  final BlockShape block;
  final int index;
  final bool canFit;
  final VoidCallback onDragStarted;
  final VoidCallback onDragEnd;

  const _DraggableBlock({
    required this.block,
    required this.index,
    required this.canFit,
    required this.onDragStarted,
    required this.onDragEnd,
  });

  @override
  Widget build(BuildContext context) {
    const miniCellSize = 18.0;
    const dragCellSize = 32.0;

    final shapeMatrixWidget = _buildShapeMatrix(block, miniCellSize);
    final dragFeedbackWidget = Material(
      color: Colors.transparent,
      child: _buildShapeMatrix(block, dragCellSize),
    );

    return Opacity(
      opacity: canFit ? 1.0 : 0.45,
      child: Draggable<DragPayload>(
        data: DragPayload(
          blockIndex: index,
          block: block,
          touchRowOffset: block.rows ~/ 2,
          touchColOffset: block.cols ~/ 2,
        ),
        feedback: Transform.translate(
          offset: const Offset(-45, -65),
          child: dragFeedbackWidget,
        ),
        childWhenDragging: Opacity(
          opacity: 0.2,
          child: shapeMatrixWidget,
        ),
        onDragStarted: onDragStarted,
        onDragEnd: (_) => onDragEnd(),
        child: Container(
          padding: const EdgeInsets.all(8),
          child: shapeMatrixWidget,
        ),
      ),
    );
  }

  Widget _buildShapeMatrix(BlockShape shape, double cellSize) {
    const gap = 2.5;
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(shape.rows, (r) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(shape.cols, (c) {
            final isFilled = shape.matrix[r][c] == 1;
            if (!isFilled) {
              return SizedBox(
                width: cellSize + gap,
                height: cellSize + gap,
              );
            }
            return Container(
              margin: const EdgeInsets.all(gap / 2),
              child: BlockCubeWidget(
                color: shape.color,
                topColor: shape.topColor,
                frontColor: shape.frontColor,
                rightColor: shape.rightColor,
                glowColor: shape.glow,
                size: cellSize,
              ),
            );
          }),
        );
      }),
    );
  }
}
