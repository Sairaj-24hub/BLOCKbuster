import 'package:flutter/material.dart';

enum GameModeType { classic, timeAttack, endless }

enum ObstacleDensity { none, light, medium, hardcore }

class GameModeInfo {
  final GameModeType type;
  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final bool hasTimer;
  final int initialDuration; // seconds
  final List<int> bonusPerLine;
  final Color badgeColor;

  const GameModeInfo({
    required this.type,
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.hasTimer,
    this.initialDuration = 90,
    this.bonusPerLine = const [0, 2, 5, 9, 14],
    required this.badgeColor,
  });
}

class GameConfig {
  static const int boardSize = 10;
  static const int numberOfAvailableBlocks = 3;

  // Mode Definitions
  static const Map<GameModeType, GameModeInfo> modes = {
    GameModeType.classic: GameModeInfo(
      type: GameModeType.classic,
      id: 'CLASSIC',
      title: 'Classic',
      subtitle: 'Strategic block placement. Beat your personal best.',
      icon: Icons.emoji_events_rounded,
      hasTimer: false,
      badgeColor: Color(0xFF6366F1),
    ),
    GameModeType.timeAttack: GameModeInfo(
      type: GameModeType.timeAttack,
      id: 'TIME_ATTACK',
      title: 'Time Attack',
      subtitle: 'Score as much as possible before time runs out.',
      icon: Icons.local_fire_department_rounded,
      hasTimer: true,
      initialDuration: 90,
      bonusPerLine: [0, 2, 5, 9, 14],
      badgeColor: Color(0xFFF43F5E),
    ),
    GameModeType.endless: GameModeInfo(
      type: GameModeType.endless,
      id: 'ENDLESS',
      title: 'Endless',
      subtitle: 'No timer. Relaxed puzzle solving at your own pace.',
      icon: Icons.all_inclusive_rounded,
      hasTimer: false,
      badgeColor: Color(0xFF10B981),
    ),
  };

  // Scoring
  static const int pointsPerCell = 10;
  static const Map<int, int> linePoints = {
    1: 100,
    2: 300,
    3: 650,
    4: 1100,
    5: 1800,
    6: 2700,
  };
  static const List<double> comboMultipliers = [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0];
  static const int streakBonusBase = 50;
  static const int perfectClearBonus = 2000;

  // Animation Timings (ms)
  static const int lineHighlightMs = 160;
  static const int lineClearMs = 320;
  static const int particleDurationMs = 700;
  static const int scoreFloatMs = 1000;
}
