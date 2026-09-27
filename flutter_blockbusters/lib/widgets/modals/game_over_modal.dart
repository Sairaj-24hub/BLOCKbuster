import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class GameOverModal extends StatelessWidget {
  final GameViewModel vm;

  const GameOverModal({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 400),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: vm.isNewHighScore ? const Color(0xFFFBBF24) : const Color(0xFFF43F5E),
            width: 1.8,
          ),
          boxShadow: [
            BoxShadow(
              color: (vm.isNewHighScore ? const Color(0xFFFBBF24) : const Color(0xFFF43F5E)).withValues(alpha: 0.25),
              blurRadius: 30,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // High Score Banner or Game Over Icon
            if (vm.isNewHighScore)
              Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.emoji_events_rounded, color: Colors.white, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      'NEW HIGH SCORE!',
                      style: GoogleFonts.spaceGrotesk(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),
              ),

            Text(
              'GAME OVER',
              style: GoogleFonts.outfit(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                letterSpacing: 2.0,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'No more legal moves available',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 12,
                color: const Color(0xFF94A3B8),
              ),
            ),

            const SizedBox(height: 20),

            // Big Score Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B).withValues(alpha: 0.8),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(
                  color: const Color(0xFF38BDF8).withValues(alpha: 0.2),
                  width: 1,
                ),
              ),
              child: Column(
                children: [
                  Text(
                    'FINAL SCORE',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF94A3B8),
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${vm.score}',
                    style: GoogleFonts.outfit(
                      fontSize: 38,
                      fontWeight: FontWeight.w900,
                      color: const Color(0xFF38BDF8),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Stats breakdown
            Row(
              children: [
                _StatCard(label: 'Lines', value: '${vm.linesCleared}', icon: Icons.clear_all_rounded, color: const Color(0xFF10B981)),
                const SizedBox(width: 8),
                _StatCard(label: 'Streak', value: '${vm.highestCombo}x', icon: Icons.local_fire_department_rounded, color: const Color(0xFFF97316)),
                const SizedBox(width: 8),
                _StatCard(label: 'Blocks', value: '${vm.blocksPlaced}', icon: Icons.grid_view_rounded, color: const Color(0xFFA855F7)),
              ],
            ),

            const SizedBox(height: 24),

            // Action Buttons
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () => vm.startNewGame(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
                child: Text(
                  'PLAY AGAIN',
                  style: GoogleFonts.outfit(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => vm.openModal(ActiveModal.leaderboard),
                    icon: const Icon(Icons.leaderboard_rounded, size: 18),
                    label: Text('RANKINGS', style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.w700)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFFFBBF24),
                      side: const BorderSide(color: Color(0xFFFBBF24)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: vm.goToHome,
                    icon: const Icon(Icons.home_rounded, size: 18),
                    label: Text('MENU', style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.w700)),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF94A3B8),
                      side: const BorderSide(color: Color(0xFF475569)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B).withValues(alpha: 0.6),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: color.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        child: Column(
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(height: 4),
            Text(
              value,
              style: GoogleFonts.outfit(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
            Text(
              label,
              style: GoogleFonts.spaceGrotesk(
                fontSize: 10,
                color: const Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
