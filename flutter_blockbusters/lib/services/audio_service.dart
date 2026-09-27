import 'package:flutter/services.dart';

class AudioService {
  static bool sfxEnabled = true;
  static bool bgmEnabled = true;

  static void setSfx(bool enabled) {
    sfxEnabled = enabled;
  }

  static void setBgm(bool enabled) {
    bgmEnabled = enabled;
  }

  static void playPickup() {
    if (!sfxEnabled) return;
    HapticFeedback.selectionClick();
  }

  static void playPlace() {
    if (!sfxEnabled) return;
    HapticFeedback.lightImpact();
  }

  static void playLineClear(int count) {
    if (!sfxEnabled) return;
    HapticFeedback.mediumImpact();
    SystemSound.play(SystemSoundType.click);
  }

  static void playCombo(int streak) {
    if (!sfxEnabled) return;
    HapticFeedback.heavyImpact();
    SystemSound.play(SystemSoundType.alert);
  }

  static void playGameOver() {
    if (!sfxEnabled) return;
    HapticFeedback.vibrate();
    SystemSound.play(SystemSoundType.alert);
  }

  static void playButtonClick() {
    if (!sfxEnabled) return;
    HapticFeedback.selectionClick();
  }

  static void playCountdownTick() {
    if (!sfxEnabled) return;
    HapticFeedback.selectionClick();
  }
}
