import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class PauseModal extends StatelessWidget {
  final GameViewModel vm;

  const PauseModal({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        constraints: const BoxConstraints(maxWidth: 380),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFF38BDF8).withValues(alpha: 0.3),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.8),
              blurRadius: 30,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'GAME PAUSED',
              style: GoogleFonts.outfit(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 16),

            // Current Score Summary
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF1E293B).withValues(alpha: 0.7),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Score', style: GoogleFonts.spaceGrotesk(color: const Color(0xFF94A3B8))),
                  Text(
                    '${vm.score}',
                    style: GoogleFonts.outfit(
                      color: const Color(0xFF38BDF8),
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Resume Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton.icon(
                onPressed: vm.resumeGame,
                icon: const Icon(Icons.play_arrow_rounded),
                label: Text('RESUME', style: GoogleFonts.outfit(fontWeight: FontWeight.w800, letterSpacing: 1)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Restart Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: OutlinedButton.icon(
                onPressed: () => vm.startNewGame(),
                icon: const Icon(Icons.refresh_rounded, color: Color(0xFF38BDF8)),
                label: Text('RESTART', style: GoogleFonts.outfit(color: const Color(0xFF38BDF8), fontWeight: FontWeight.w800)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF38BDF8)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ),
            const SizedBox(height: 10),

            // Quit to Home
            SizedBox(
              width: double.infinity,
              height: 50,
              child: TextButton.icon(
                onPressed: vm.goToHome,
                icon: const Icon(Icons.home_rounded, color: Color(0xFF94A3B8)),
                label: Text('MAIN MENU', style: GoogleFonts.outfit(color: const Color(0xFF94A3B8), fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
