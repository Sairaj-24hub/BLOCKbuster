import 'package:flutter/material.dart';
import '../constants/game_config.dart';
import '../models/block_shape.dart';
import '../viewmodels/game_viewmodel.dart';
import 'block_cube_widget.dart';

class DragPayload {
  final int blockIndex;
  final BlockShape block;
  final int touchRowOffset;
  final int touchColOffset;

  const DragPayload({
    required this.blockIndex,
    required this.block,
    this.touchRowOffset = 0,
    this.touchColOffset = 0,
  });
}

class GameBoardWidget extends StatelessWidget {
  final GameViewModel vm;

  const GameBoardWidget({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final availableWidth = constraints.maxWidth;
        final availableHeight = constraints.maxHeight;

        final maxBoardDimension = (availableWidth < availableHeight ? availableWidth : availableHeight) - 24;
        final clampedDimension = maxBoardDimension.clamp(280.0, 480.0);

        const boardSize = GameConfig.boardSize;
        const gap = 3.5;
        final cellSize = (clampedDimension - ((boardSize - 1) * gap) - 16) / boardSize;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 100),
          transform: vm.isShaking
              ? Matrix4.translationValues(
                  (Theme.of(context).platform == TargetPlatform.android ? 3.0 : 4.0),
                  (Theme.of(context).platform == TargetPlatform.android ? -2.0 : -3.0),
                  0,
                )
              : Matrix4.identity(),
          child: Container(
            width: clampedDimension,
            height: clampedDimension,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A).withValues(alpha: 0.85),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: const Color(0xFF38BDF8).withValues(alpha: 0.3),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6366F1).withValues(alpha: 0.15),
                  blurRadius: 24,
                  spreadRadius: 2,
                ),
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.6),
                  blurRadius: 15,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: GridView.builder(
              physics: const NeverScrollableScrollPhysics(),
              itemCount: boardSize * boardSize,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: boardSize,
                mainAxisSpacing: gap,
                crossAxisSpacing: gap,
              ),
              itemBuilder: (context, index) {
                final r = index ~/ boardSize;
                final c = index % boardSize;

                final cell = vm.board[r][c];
                final isClearing = vm.clearingRows.contains(r) || vm.clearingCols.contains(c);

                // Check if this cell is part of ghost preview
                bool isGhost = false;
                BlockShape? ghostShape;
                if (vm.ghostPosition != null && vm.draggingBlock != null) {
                  final gr = vm.ghostPosition!.x;
                  final gc = vm.ghostPosition!.y;
                  final shape = vm.draggingBlock!;

                  if (r >= gr && r < gr + shape.rows && c >= gc && c < gc + shape.cols) {
                    if (shape.matrix[r - gr][c - gc] == 1) {
                      isGhost = true;
                      ghostShape = shape;
                    }
                  }
                }

                return DragTarget<DragPayload>(
                  onWillAcceptWithDetails: (details) {
                    final payload = details.data;
                    final targetRow = r - payload.touchRowOffset;
                    final targetCol = c - payload.touchColOffset;
                    vm.updateGhostPosition(targetRow, targetCol, payload.block);
                    return true;
                  },
                  onLeave: (data) {
                    // Handled inside tray/viewmodel
                  },
                  onAcceptWithDetails: (details) {
                    final payload = details.data;
                    final targetRow = r - payload.touchRowOffset;
                    final targetCol = c - payload.touchColOffset;
                    vm.placeBlockAt(payload.blockIndex, targetRow, targetCol);
                  },
                  builder: (context, candidateData, rejectedData) {
                    return Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(cellSize * 0.18),
                        border: Border.all(
                          color: const Color(0xFF334155).withValues(alpha: 0.5),
                          width: 0.8,
                        ),
                      ),
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          if (cell != null)
                            BlockCubeWidget(
                              color: cell.color,
                              topColor: cell.topColor,
                              frontColor: cell.frontColor,
                              rightColor: cell.rightColor,
                              glowColor: cell.glow,
                              size: cellSize,
                              isClearing: isClearing,
                            )
                          else if (isGhost && ghostShape != null)
                            BlockCubeWidget(
                              color: ghostShape.color,
                              topColor: ghostShape.topColor,
                              frontColor: ghostShape.frontColor,
                              rightColor: ghostShape.rightColor,
                              glowColor: ghostShape.glow,
                              size: cellSize,
                              isGhost: true,
                            ),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        );
      },
    );
  }
}
