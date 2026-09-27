class UserProfile {
  final String username;
  final String avatar;
  final int createdAt;

  const UserProfile({
    required this.username,
    required this.avatar,
    required this.createdAt,
  });

  Map<String, dynamic> toJson() => {
    'username': username,
    'avatar': avatar,
    'createdAt': createdAt,
  };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
    username: json['username'] as String? ?? 'CyberPlayer',
    avatar: json['avatar'] as String? ?? '⚡',
    createdAt: json['createdAt'] as int? ?? DateTime.now().millisecondsSinceEpoch,
  );
}

class GameSettings {
  final bool sfxEnabled;
  final bool bgmEnabled;
  final bool perspective3D;
  final String starterObstacles; // 'NONE' | 'LIGHT' | 'MEDIUM' | 'HARDCORE'
  final bool enableFallingParticles;

  const GameSettings({
    this.sfxEnabled = true,
    this.bgmEnabled = true,
    this.perspective3D = true,
    this.starterObstacles = 'MEDIUM',
    this.enableFallingParticles = true,
  });

  GameSettings copyWith({
    bool? sfxEnabled,
    bool? bgmEnabled,
    bool? perspective3D,
    String? starterObstacles,
    bool? enableFallingParticles,
  }) {
    return GameSettings(
      sfxEnabled: sfxEnabled ?? this.sfxEnabled,
      bgmEnabled: bgmEnabled ?? this.bgmEnabled,
      perspective3D: perspective3D ?? this.perspective3D,
      starterObstacles: starterObstacles ?? this.starterObstacles,
      enableFallingParticles: enableFallingParticles ?? this.enableFallingParticles,
    );
  }

  Map<String, dynamic> toJson() => {
    'sfxEnabled': sfxEnabled,
    'bgmEnabled': bgmEnabled,
    'perspective3D': perspective3D,
    'starterObstacles': starterObstacles,
    'enableFallingParticles': enableFallingParticles,
  };

  factory GameSettings.fromJson(Map<String, dynamic> json) => GameSettings(
    sfxEnabled: json['sfxEnabled'] as bool? ?? true,
    bgmEnabled: json['bgmEnabled'] as bool? ?? true,
    perspective3D: json['perspective3D'] as bool? ?? true,
    starterObstacles: json['starterObstacles'] as String? ?? 'MEDIUM',
    enableFallingParticles: json['enableFallingParticles'] as bool? ?? true,
  );
}

class GameRecord {
  final String id;
  final String mode;
  final int score;
  final int linesCleared;
  final int highestCombo;
  final int blocksPlaced;
  final String username;
  final int timestamp;

  const GameRecord({
    required this.id,
    required this.mode,
    required this.score,
    required this.linesCleared,
    required this.highestCombo,
    required this.blocksPlaced,
    required this.username,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'mode': mode,
    'score': score,
    'linesCleared': linesCleared,
    'highestCombo': highestCombo,
    'blocksPlaced': blocksPlaced,
    'username': username,
    'timestamp': timestamp,
  };

  factory GameRecord.fromJson(Map<String, dynamic> json) => GameRecord(
    id: json['id'] as String? ?? '',
    mode: json['mode'] as String? ?? 'CLASSIC',
    score: json['score'] as int? ?? 0,
    linesCleared: json['linesCleared'] as int? ?? 0,
    highestCombo: json['highestCombo'] as int? ?? 0,
    blocksPlaced: json['blocksPlaced'] as int? ?? 0,
    username: json['username'] as String? ?? 'Player',
    timestamp: json['timestamp'] as int? ?? DateTime.now().millisecondsSinceEpoch,
  );
}
