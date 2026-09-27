import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_profile.dart';

class StorageService {
  static const String _kProfileKey = 'blockbusters_profile_v1';
  static const String _kHighScoresKey = 'blockbusters_highscores_v1';
  static const String _kSettingsKey = 'blockbusters_settings_v1';
  static const String _kRecentGamesKey = 'blockbusters_recent_v1';

  static SharedPreferences? _prefs;

  static Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  static UserProfile? getProfile() {
    final raw = _prefs?.getString(_kProfileKey);
    if (raw == null) return null;
    try {
      return UserProfile.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  static Future<void> saveProfile(UserProfile profile) async {
    await _prefs?.setString(_kProfileKey, jsonEncode(profile.toJson()));
  }

  static Map<String, int> getHighScores() {
    final raw = _prefs?.getString(_kHighScoresKey);
    if (raw == null) {
      return {'CLASSIC': 0, 'TIME_ATTACK': 0, 'ENDLESS': 0};
    }
    try {
      final Map<String, dynamic> decoded = jsonDecode(raw);
      return {
        'CLASSIC': (decoded['CLASSIC'] as num?)?.toInt() ?? 0,
        'TIME_ATTACK': (decoded['TIME_ATTACK'] as num?)?.toInt() ?? 0,
        'ENDLESS': (decoded['ENDLESS'] as num?)?.toInt() ?? 0,
      };
    } catch (_) {
      return {'CLASSIC': 0, 'TIME_ATTACK': 0, 'ENDLESS': 0};
    }
  }

  static Future<bool> recordGameResult(GameRecord record) async {
    final highScores = getHighScores();
    final currentHigh = highScores[record.mode] ?? 0;
    bool isNewHigh = false;

    if (record.score > currentHigh) {
      highScores[record.mode] = record.score;
      await _prefs?.setString(_kHighScoresKey, jsonEncode(highScores));
      isNewHigh = true;
    }

    final recent = getRecentGames();
    recent.insert(0, record);
    if (recent.length > 20) {
      recent.removeRange(20, recent.length);
    }

    final rawRecent = jsonEncode(recent.map((r) => r.toJson()).toList());
    await _prefs?.setString(_kRecentGamesKey, rawRecent);

    return isNewHigh;
  }

  static List<GameRecord> getRecentGames() {
    final raw = _prefs?.getString(_kRecentGamesKey);
    if (raw == null) return [];
    try {
      final List<dynamic> list = jsonDecode(raw);
      return list.map((item) => GameRecord.fromJson(item as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  static GameSettings getSettings() {
    final raw = _prefs?.getString(_kSettingsKey);
    if (raw == null) return const GameSettings();
    try {
      return GameSettings.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return const GameSettings();
    }
  }

  static Future<void> saveSettings(GameSettings settings) async {
    await _prefs?.setString(_kSettingsKey, jsonEncode(settings.toJson()));
  }

  static Future<void> resetAllData() async {
    await _prefs?.remove(_kProfileKey);
    await _prefs?.remove(_kHighScoresKey);
    await _prefs?.remove(_kSettingsKey);
    await _prefs?.remove(_kRecentGamesKey);
  }
}
