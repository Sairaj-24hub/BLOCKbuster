import 'package:flutter/material.dart';

enum ShapeCategory { small, medium, large }

class BlockShape {
  final String id;
  final String name;
  final List<List<int>> matrix;
  final ShapeCategory category;
  final double baseWeight;
  final Color color;
  final Color glow;
  final Color topColor;
  final Color frontColor;
  final Color rightColor;
  final String? instanceId;

  const BlockShape({
    required this.id,
    required this.name,
    required this.matrix,
    required this.category,
    required this.baseWeight,
    required this.color,
    required this.glow,
    required this.topColor,
    required this.frontColor,
    required this.rightColor,
    this.instanceId,
  });

  int get rows => matrix.length;
  int get cols => matrix[0].length;

  int get cellCount {
    int count = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (matrix[r][c] == 1) count++;
      }
    }
    return count;
  }

  BlockShape copyWithInstanceId(String newInstanceId) {
    return BlockShape(
      id: id,
      name: name,
      matrix: matrix,
      category: category,
      baseWeight: baseWeight,
      color: color,
      glow: glow,
      topColor: topColor,
      frontColor: frontColor,
      rightColor: rightColor,
      instanceId: newInstanceId,
    );
  }
}

// All 17 polyomino shapes definitions exactly from gameConfig.js
final List<BlockShape> kAllShapes = [
  // 1. Single Dot (1x1)
  const BlockShape(
    id: 'dot_1x1',
    name: 'Single Cube',
    matrix: [
      [1],
    ],
    category: ShapeCategory.small,
    baseWeight: 8,
    color: Color(0xFF06B6D4), // Cyan
    glow: Color(0x7306B6D4),
    topColor: Color(0xFF67E8F9),
    frontColor: Color(0xFF0891B2),
    rightColor: Color(0xFF0E7490),
  ),

  // 2. 2-Line Horizontal (1x2)
  const BlockShape(
    id: 'line_1x2',
    name: '2-Bar H',
    matrix: [
      [1, 1],
    ],
    category: ShapeCategory.small,
    baseWeight: 10,
    color: Color(0xFF10B981), // Emerald
    glow: Color(0x7310B981),
    topColor: Color(0xFF6EE7B7),
    frontColor: Color(0xFF059669),
    rightColor: Color(0xFF047857),
  ),

  // 3. 2-Line Vertical (2x1)
  const BlockShape(
    id: 'line_2x1',
    name: '2-Bar V',
    matrix: [
      [1],
      [1],
    ],
    category: ShapeCategory.small,
    baseWeight: 10,
    color: Color(0xFF10B981),
    glow: Color(0x7310B981),
    topColor: Color(0xFF6EE7B7),
    frontColor: Color(0xFF059669),
    rightColor: Color(0xFF047857),
  ),

  // 4. 3-Line Horizontal (1x3)
  const BlockShape(
    id: 'line_1x3',
    name: '3-Bar H',
    matrix: [
      [1, 1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 11,
    color: Color(0xFF84CC16), // Lime
    glow: Color(0x7384CC16),
    topColor: Color(0xFFBEF264),
    frontColor: Color(0xFF65A30D),
    rightColor: Color(0xFF4D7C0F),
  ),

  // 5. 3-Line Vertical (3x1)
  const BlockShape(
    id: 'line_3x1',
    name: '3-Bar V',
    matrix: [
      [1],
      [1],
      [1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 11,
    color: Color(0xFF84CC16),
    glow: Color(0x7384CC16),
    topColor: Color(0xFFBEF264),
    frontColor: Color(0xFF65A30D),
    rightColor: Color(0xFF4D7C0F),
  ),

  // 6. 4-Line Horizontal (1x4)
  const BlockShape(
    id: 'line_1x4',
    name: '4-Bar H',
    matrix: [
      [1, 1, 1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 8,
    color: Color(0xFFEAB308), // Amber
    glow: Color(0x73EAB308),
    topColor: Color(0xFFFDE047),
    frontColor: Color(0xFFCA8A04),
    rightColor: Color(0xFFA16207),
  ),

  // 7. 4-Line Vertical (4x1)
  const BlockShape(
    id: 'line_4x1',
    name: '4-Bar V',
    matrix: [
      [1],
      [1],
      [1],
      [1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 8,
    color: Color(0xFFEAB308),
    glow: Color(0x73EAB308),
    topColor: Color(0xFFFDE047),
    frontColor: Color(0xFFCA8A04),
    rightColor: Color(0xFFA16207),
  ),

  // 8. 5-Line Horizontal (1x5)
  const BlockShape(
    id: 'line_1x5',
    name: '5-Bar H',
    matrix: [
      [1, 1, 1, 1, 1],
    ],
    category: ShapeCategory.large,
    baseWeight: 5,
    color: Color(0xFFF97316), // Orange
    glow: Color(0x73F97316),
    topColor: Color(0xFFFDBA74),
    frontColor: Color(0xFFEA580C),
    rightColor: Color(0xFFC2410C),
  ),

  // 9. 5-Line Vertical (5x1)
  const BlockShape(
    id: 'line_5x1',
    name: '5-Bar V',
    matrix: [
      [1],
      [1],
      [1],
      [1],
      [1],
    ],
    category: ShapeCategory.large,
    baseWeight: 5,
    color: Color(0xFFF97316),
    glow: Color(0x73F97316),
    topColor: Color(0xFFFDBA74),
    frontColor: Color(0xFFEA580C),
    rightColor: Color(0xFFC2410C),
  ),

  // 10. 2x2 Square
  const BlockShape(
    id: 'square_2x2',
    name: 'Square 2x2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 12,
    color: Color(0xFF3B82F6), // Blue
    glow: Color(0x733B82F6),
    topColor: Color(0xFF93C5FD),
    frontColor: Color(0xFF2563EB),
    rightColor: Color(0xFF1D4ED8),
  ),

  // 11. 3x3 Square
  const BlockShape(
    id: 'square_3x3',
    name: 'Square 3x3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    category: ShapeCategory.large,
    baseWeight: 4,
    color: Color(0xFFA855F7), // Purple
    glow: Color(0x73A855F7),
    topColor: Color(0xFFD8B4FE),
    frontColor: Color(0xFF9333EA),
    rightColor: Color(0xFF7E22CE),
  ),

  // 12. Corner 2x2 (3 cells) - 4 orientations
  const BlockShape(
    id: 'corner_tl',
    name: 'Corner TL',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    category: ShapeCategory.small,
    baseWeight: 9,
    color: Color(0xFF0284C7), // Sky
    glow: Color(0x730284C7),
    topColor: Color(0xFF7DD3FC),
    frontColor: Color(0xFF0369A1),
    rightColor: Color(0xFF075985),
  ),
  const BlockShape(
    id: 'corner_tr',
    name: 'Corner TR',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    category: ShapeCategory.small,
    baseWeight: 9,
    color: Color(0xFF0284C7),
    glow: Color(0x730284C7),
    topColor: Color(0xFF7DD3FC),
    frontColor: Color(0xFF0369A1),
    rightColor: Color(0xFF075985),
  ),
  const BlockShape(
    id: 'corner_bl',
    name: 'Corner BL',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    category: ShapeCategory.small,
    baseWeight: 9,
    color: Color(0xFF0284C7),
    glow: Color(0x730284C7),
    topColor: Color(0xFF7DD3FC),
    frontColor: Color(0xFF0369A1),
    rightColor: Color(0xFF075985),
  ),
  const BlockShape(
    id: 'corner_br',
    name: 'Corner BR',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    category: ShapeCategory.small,
    baseWeight: 9,
    color: Color(0xFF0284C7),
    glow: Color(0x730284C7),
    topColor: Color(0xFF7DD3FC),
    frontColor: Color(0xFF0369A1),
    rightColor: Color(0xFF075985),
  ),

  // 13. L-Shapes (3x2 and 2x3 - 4 cells) - 4 rotations
  const BlockShape(
    id: 'L_up_left',
    name: 'L-Shape 1',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFFEC4899), // Pink
    glow: Color(0x73EC4899),
    topColor: Color(0xFFF472B6),
    frontColor: Color(0xFFDB2777),
    rightColor: Color(0xFFBE185D),
  ),
  const BlockShape(
    id: 'L_up_right',
    name: 'L-Shape 2',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFFEC4899),
    glow: Color(0x73EC4899),
    topColor: Color(0xFFF472B6),
    frontColor: Color(0xFFDB2777),
    rightColor: Color(0xFFBE185D),
  ),
  const BlockShape(
    id: 'L_h_left',
    name: 'L-Shape 3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFFEC4899),
    glow: Color(0x73EC4899),
    topColor: Color(0xFFF472B6),
    frontColor: Color(0xFFDB2777),
    rightColor: Color(0xFFBE185D),
  ),
  const BlockShape(
    id: 'L_h_right',
    name: 'L-Shape 4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFFEC4899),
    glow: Color(0x73EC4899),
    topColor: Color(0xFFF472B6),
    frontColor: Color(0xFFDB2777),
    rightColor: Color(0xFFBE185D),
  ),

  // 14. Big Corner (3x3 - 5 cells)
  const BlockShape(
    id: 'big_corner_bl',
    name: 'Big Corner',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    category: ShapeCategory.large,
    baseWeight: 4,
    color: Color(0xFFF43F5E), // Rose
    glow: Color(0x73F43F5E),
    topColor: Color(0xFFFB7185),
    frontColor: Color(0xFFE11D48),
    rightColor: Color(0xFFBE123C),
  ),
  const BlockShape(
    id: 'big_corner_br',
    name: 'Big Corner BR',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    category: ShapeCategory.large,
    baseWeight: 4,
    color: Color(0xFFF43F5E),
    glow: Color(0x73F43F5E),
    topColor: Color(0xFFFB7185),
    frontColor: Color(0xFFE11D48),
    rightColor: Color(0xFFBE123C),
  ),

  // 15. T-Shapes (4 cells)
  const BlockShape(
    id: 'T_down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFF6366F1), // Indigo
    glow: Color(0x736366F1),
    topColor: Color(0xFFA5B4FC),
    frontColor: Color(0xFF4F46E5),
    rightColor: Color(0xFF4338CA),
  ),
  const BlockShape(
    id: 'T_up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 7,
    color: Color(0xFF6366F1),
    glow: Color(0x736366F1),
    topColor: Color(0xFFA5B4FC),
    frontColor: Color(0xFF4F46E5),
    rightColor: Color(0xFF4338CA),
  ),

  // 16. Z/S Zigzags (4 cells)
  const BlockShape(
    id: 'Z_h',
    name: 'Z-Shape H',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    category: ShapeCategory.medium,
    baseWeight: 6,
    color: Color(0xFF14B8A6), // Teal
    glow: Color(0x7314B8A6),
    topColor: Color(0xFF5EEAD4),
    frontColor: Color(0xFF0D9488),
    rightColor: Color(0xFF0F766E),
  ),
  const BlockShape(
    id: 'S_h',
    name: 'S-Shape H',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    category: ShapeCategory.medium,
    baseWeight: 6,
    color: Color(0xFF14B8A6),
    glow: Color(0x7314B8A6),
    topColor: Color(0xFF5EEAD4),
    frontColor: Color(0xFF0D9488),
    rightColor: Color(0xFF0F766E),
  ),

  // 17. Plus / Cross shape
  const BlockShape(
    id: 'cross_3x3',
    name: 'Plus Shape',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    category: ShapeCategory.large,
    baseWeight: 3,
    color: Color(0xFFE11D48), // Crimson
    glow: Color(0x73E11D48),
    topColor: Color(0xFFF43F5E),
    frontColor: Color(0xFFBE123C),
    rightColor: Color(0xFF9F1239),
  ),
];
