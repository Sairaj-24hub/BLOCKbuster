import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import '../constants/game_config.dart';
import '../models/block_shape.dart';
import '../models/placed_cell.dart';
import '../models/user_profile.dart';
import '../services/audio_service.dart';
import '../services/storage_service.dart';
import '../utils/block_generator.dart';
import '../utils/board_logic.dart';

enum GameState { home, playing, paused, gameOver }

enum ActiveModal { none, modes, username, leaderboard, howToPlay, settings }

class ScoreFlyer {
  final String text;
  final int points;
  final double x;
  final double y;
  final Color color;
  final int timestamp;

  const ScoreFlyer({
    required this.text,
    required this.points,
    required this.x,
    required this.y,
    required this.color,
    required this.timestamp,
  });
}

class GameViewModel extends ChangeNotifier {
  // State
  GameState _gameState = GameState.home;
  ActiveModal _activeModal = ActiveModal.none;

  UserProfile? _profile;
  GameModeInfo _currentMode = GameConfig.modes[GameModeType.classic]!;
  Map<String, int> _bestScores = {'CLASSIC': 0, 'TIME_ATTACK': 0, 'ENDLESS': 0};
  GameSettings _settings = const GameSettings();

  List<List<PlacedCell?>> _board = BoardLogic.createEmptyBoard();
  List<BlockShape?> _availableBlocks = [null, null, null];

  int _score = 0;
  int _linesCleared = 0;
  int _comboStreak = 0;
  int _highestCombo = 0;
  int _blocksPlaced = 0;
  bool _isNewHighScore = false;

  int? _timeLeft;
  Timer? _timer;

  List<int> _clearingRows = [];
  List<int> _clearingCols = [];
  Point<int>? _ghostPosition;
  BlockShape? _draggingBlock;
  bool _isShaking = false;

  final List<ScoreFlyer> _flyers = [];

  // Getters
  GameState get gameState => _gameState;
  ActiveModal get activeModal => _activeModal;
  UserProfile? get profile => _profile;
  GameModeInfo get currentMode => _currentMode;
  Map<String, int> get bestScores => _bestScores;
  GameSettings get settings => _settings;
  List<List<PlacedCell?>> get board => _board;
  List<BlockShape?> get availableBlocks => _availableBlocks;
  int get score => _score;
  int get linesCleared => _linesCleared;
  int get comboStreak => _comboStreak;
  int get highestCombo => _highestCombo;
  int get blocksPlaced => _blocksPlaced;
  bool get isNewHighScore => _isNewHighScore;
  int? get timeLeft => _timeLeft;
  List<int> get clearingRows => _clearingRows;
  List<int> get clearingCols => _clearingCols;
  Point<int>? get ghostPosition => _ghostPosition;
  BlockShape? get draggingBlock => _draggingBlock;
  bool get isShaking => _isShaking;
  List<ScoreFlyer> get flyers => _flyers;

  int get currentBestScore => _bestScores[_currentMode.id] ?? 0;

  Future<void> init() async {
    await StorageService.init();
    _profile = StorageService.getProfile();
    _bestScores = StorageService.getHighScores();
    _settings = StorageService.getSettings();

    AudioService.setSfx(_settings.sfxEnabled);
    AudioService.setBgm(_settings.bgmEnabled);

    if (_profile == null) {
      _activeModal = ActiveModal.username;
    }
    notifyListeners();
  }

  void openModal(ActiveModal modal) {
    AudioService.playButtonClick();
    _activeModal = modal;
    notifyListeners();
  }

  void closeModal() {
    AudioService.playButtonClick();
    _activeModal = ActiveModal.none;
    notifyListeners();
  }

  void selectMode(GameModeInfo mode) {
    _currentMode = mode;
    closeModal();
  }

  void startNewGame({GameModeInfo? mode}) {
    if (mode != null) {
      _currentMode = mode;
    }

    _score = 0;
    _linesCleared = 0;
    _comboStreak = 0;
    _highestCombo = 0;
    _blocksPlaced = 0;
    _isNewHighScore = false;
    _clearingRows = [];
    _clearingCols = [];
    _ghostPosition = null;
    _draggingBlock = null;

    // Create board according to density setting
    _board = BoardLogic.createSeededBoard(_settings.starterObstacles);
    _availableBlocks = BlockGenerator.generateThreeBlocks(_board);

    // Timer setup for Time Attack
    _timer?.cancel();
    if (_currentMode.hasTimer) {
      _timeLeft = _currentMode.initialDuration;
      _startTimer();
    } else {
      _timeLeft = null;
    }

    _gameState = GameState.playing;
    _activeModal = ActiveModal.none;
    AudioService.playButtonClick();
    notifyListeners();
  }

  void _startTimer() {
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_gameState != GameState.playing) return;
      if (_timeLeft == null) return;

      if (_timeLeft! <= 1) {
        _timeLeft = 0;
        _timer?.cancel();
        _triggerGameOver();
      } else {
        _timeLeft = _timeLeft! - 1;
        if (_timeLeft! <= 10) {
          AudioService.playCountdownTick();
        }
        notifyListeners();
      }
    });
  }

  void pauseGame() {
    if (_gameState == GameState.playing) {
      _gameState = GameState.paused;
      AudioService.playButtonClick();
      notifyListeners();
    }
  }

  void resumeGame() {
    if (_gameState == GameState.paused) {
      _gameState = GameState.playing;
      AudioService.playButtonClick();
      notifyListeners();
    }
  }

  void goToHome() {
    _timer?.cancel();
    _gameState = GameState.home;
    _activeModal = ActiveModal.none;
    AudioService.playButtonClick();
    notifyListeners();
  }

  void setDraggingBlock(BlockShape? block) {
    _draggingBlock = block;
    if (block != null) {
      AudioService.playPickup();
    }
    notifyListeners();
  }

  void updateGhostPosition(int row, int col, BlockShape block) {
    if (BoardLogic.canPlaceBlock(_board, block, row, col)) {
      if (_ghostPosition?.x != row || _ghostPosition?.y != col) {
        _ghostPosition = Point<int>(row, col);
        notifyListeners();
      }
    } else {
      if (_ghostPosition != null) {
        _ghostPosition = null;
        notifyListeners();
      }
    }
  }

  void clearGhostPosition() {
    if (_ghostPosition != null) {
      _ghostPosition = null;
      notifyListeners();
    }
  }

  Future<void> placeBlockAt(int blockIndex, int startRow, int startCol) async {
    final block = _availableBlocks[blockIndex];
    if (block == null) return;

    if (!BoardLogic.canPlaceBlock(_board, block, startRow, startCol)) {
      _ghostPosition = null;
      _draggingBlock = null;
      notifyListeners();
      return;
    }

    _draggingBlock = null;
    _ghostPosition = null;

    // 1. Place the block
    _board = BoardLogic.placeBlock(_board, block, startRow, startCol);
    _availableBlocks[blockIndex] = null;
    _blocksPlaced++;
    AudioService.playPlace();

    // 2. Check for completed lines
    final completed = BoardLogic.findCompletedLines(_board);
    final isBoardEmpty = BoardLogic.isBoardCompletelyEmpty(_board);

    final scoreResult = BoardLogic.calculateScoreBreakdown(
      block: block,
      linesCount: completed.totalLines,
      currentStreak: _comboStreak,
      isBoardCleared: isBoardEmpty,
    );

    _score += scoreResult.totalGain;
    _comboStreak = scoreResult.newStreak;
    if (_comboStreak > _highestCombo) {
      _highestCombo = _comboStreak;
    }

    // Time attack bonus
    if (_currentMode.hasTimer && _timeLeft != null && completed.totalLines > 0) {
      final bonusIdx = min(completed.totalLines, _currentMode.bonusPerLine.length - 1);
      final bonusSeconds = _currentMode.bonusPerLine[bonusIdx];
      _timeLeft = _timeLeft! + bonusSeconds;
    }

    notifyListeners();

    // 3. Handle line clearing animation
    if (completed.totalLines > 0) {
      _clearingRows = completed.rows;
      _clearingCols = completed.cols;
      _linesCleared += completed.totalLines;
      _isShaking = true;
      AudioService.playLineClear(completed.totalLines);

      if (_comboStreak > 1) {
        AudioService.playCombo(_comboStreak);
      }

      notifyListeners();

      await Future.delayed(const Duration(milliseconds: GameConfig.lineClearMs));

      _board = BoardLogic.clearLines(_board, _clearingRows, _clearingCols);
      _clearingRows = [];
      _clearingCols = [];
      _isShaking = false;
      notifyListeners();
    }

    // 4. If all 3 blocks used, spawn next 3
    if (_availableBlocks.every((b) => b == null)) {
      _availableBlocks = BlockGenerator.generateThreeBlocks(_board);
      notifyListeners();
    }

    // 5. Game Over check
    if (!BoardLogic.canAnyBlockFit(_board, _availableBlocks)) {
      await Future.delayed(const Duration(milliseconds: 300));
      _triggerGameOver();
    }
  }

  Future<void> _triggerGameOver() async {
    _timer?.cancel();
    _gameState = GameState.gameOver;
    AudioService.playGameOver();

    final record = GameRecord(
      id: 'rec_${DateTime.now().millisecondsSinceEpoch}',
      mode: _currentMode.id,
      score: _score,
      linesCleared: _linesCleared,
      highestCombo: _highestCombo,
      blocksPlaced: _blocksPlaced,
      username: _profile?.username ?? 'Player 1',
      timestamp: DateTime.now().millisecondsSinceEpoch,
    );

    _isNewHighScore = await StorageService.recordGameResult(record);
    _bestScores = StorageService.getHighScores();
    notifyListeners();
  }

  Future<void> updateProfile(String username, String avatar) async {
    final newProf = UserProfile(
      username: username.trim().isEmpty ? 'CyberPlayer' : username.trim(),
      avatar: avatar,
      createdAt: _profile?.createdAt ?? DateTime.now().millisecondsSinceEpoch,
    );
    _profile = newProf;
    await StorageService.saveProfile(newProf);
    closeModal();
    notifyListeners();
  }

  Future<void> updateSettings(GameSettings newSettings) async {
    _settings = newSettings;
    AudioService.setSfx(newSettings.sfxEnabled);
    AudioService.setBgm(newSettings.bgmEnabled);
    await StorageService.saveSettings(newSettings);
    notifyListeners();
  }

  Future<void> resetAllData() async {
    await StorageService.resetAllData();
    _profile = null;
    _bestScores = {'CLASSIC': 0, 'TIME_ATTACK': 0, 'ENDLESS': 0};
    _settings = const GameSettings();
    _activeModal = ActiveModal.username;
    notifyListeners();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
