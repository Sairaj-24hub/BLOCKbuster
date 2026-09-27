import 'package:flutter/material.dart';

class PlacedCell {
  final Color color;
  final Color topColor;
  final Color frontColor;
  final Color rightColor;
  final Color glow;
  final String shapeId;
  final int placedAt;

  const PlacedCell({
    required this.color,
    required this.topColor,
    required this.frontColor,
    required this.rightColor,
    required this.glow,
    required this.shapeId,
    required this.placedAt,
  });

  Map<String, dynamic> toJson() => {
    'color': color.toARGB32(),
    'topColor': topColor.toARGB32(),
    'frontColor': frontColor.toARGB32(),
    'rightColor': rightColor.toARGB32(),
    'glow': glow.toARGB32(),
    'shapeId': shapeId,
    'placedAt': placedAt,
  };

  factory PlacedCell.fromJson(Map<String, dynamic> json) => PlacedCell(
    color: Color(json['color'] as int),
    topColor: Color(json['topColor'] as int),
    frontColor: Color(json['frontColor'] as int),
    rightColor: Color(json['rightColor'] as int),
    glow: Color(json['glow'] as int),
    shapeId: json['shapeId'] as String,
    placedAt: json['placedAt'] as int,
  );
}
