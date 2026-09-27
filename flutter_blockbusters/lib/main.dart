import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'viewmodels/game_viewmodel.dart';
import 'widgets/block_tray_widget.dart';
import 'widgets/game_board_widget.dart';
import 'widgets/header_widget.dart';
import 'widgets/modals/game_over_modal.dart';
import 'widgets/modals/home_screen.dart';
import 'widgets/modals/how_to_play_modal.dart';
import 'widgets/modals/leaderboard_modal.dart';
import 'widgets/modals/mode_select_modal.dart';
import 'widgets/modals/pause_modal.dart';
import 'widgets/modals/settings_modal.dart';
import 'widgets/modals/username_modal.dart';
import 'widgets/particles_overlay.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const BlockbustersApp());
}

class BlockbustersApp extends StatelessWidget {
  const BlockbustersApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BLOCKBUSTERS | 3D Arcade Block Puzzle',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF030712),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF6366F1),
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF0F172A),
        ),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
      ),
      home: const GameContainerScreen(),
    );
  }
}

class GameContainerScreen extends StatefulWidget {
  const GameContainerScreen({super.key});

  @override
  State<GameContainerScreen> createState() => _GameContainerScreenState();
}

class _GameContainerScreenState extends State<GameContainerScreen> {
  final GameViewModel _viewModel = GameViewModel();

  @override
  void initState() {
    super.initState();
    _viewModel.init();
  }

  @override
  void dispose() {
    _viewModel.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _viewModel,
      builder: (context, _) {
        return Scaffold(
          body: Container(
            decoration: const BoxDecoration(
              gradient: RadialGradient(
                center: Alignment(0, -0.3),
                radius: 1.2,
                colors: [
                  Color(0xFF1E1B4B),
                  Color(0xFF0F172A),
                  Color(0xFF030712),
                ],
              ),
            ),
            child: Stack(
              children: [
                // Ambient glowing background particles
                if (_viewModel.settings.enableFallingParticles)
                  const Positioned.fill(
                    child: AmbientParticlesWidget(),
                  ),

                // Main Content View
                SafeArea(
                  child: _buildMainView(),
                ),

                // Active Modal Overlays
                if (_viewModel.activeModal != ActiveModal.none)
                  Positioned.fill(
                    child: Container(
                      color: Colors.black.withValues(alpha: 0.65),
                      child: _buildActiveModal(),
                    ),
                  ),

                // Pause Modal Overlay
                if (_viewModel.gameState == GameState.paused)
                  Positioned.fill(
                    child: Container(
                      color: Colors.black.withValues(alpha: 0.7),
                      child: PauseModal(vm: _viewModel),
                    ),
                  ),

                // Game Over Modal Overlay
                if (_viewModel.gameState == GameState.gameOver)
                  Positioned.fill(
                    child: Container(
                      color: Colors.black.withValues(alpha: 0.75),
                      child: GameOverModal(vm: _viewModel),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMainView() {
    if (_viewModel.gameState == GameState.home) {
      return HomeScreenWidget(vm: _viewModel);
    }

    return Column(
      children: [
        // Header
        HeaderWidget(vm: _viewModel),

        const Spacer(),

        // 10x10 Game Board
        Center(
          child: GameBoardWidget(vm: _viewModel),
        ),

        const Spacer(),

        // Available Blocks Tray
        BlockTrayWidget(vm: _viewModel),

        const SizedBox(height: 12),
      ],
    );
  }

  Widget _buildActiveModal() {
    switch (_viewModel.activeModal) {
      case ActiveModal.username:
        return UsernameModal(vm: _viewModel);
      case ActiveModal.modes:
        return ModeSelectModal(vm: _viewModel);
      case ActiveModal.leaderboard:
        return LeaderboardModal(vm: _viewModel);
      case ActiveModal.howToPlay:
        return HowToPlayModal(vm: _viewModel);
      case ActiveModal.settings:
        return SettingsModal(vm: _viewModel);
      default:
        return const SizedBox.shrink();
    }
  }
}
