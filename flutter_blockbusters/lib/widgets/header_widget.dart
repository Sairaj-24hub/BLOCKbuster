import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../viewmodels/game_viewmodel.dart';

class HeaderWidget extends StatelessWidget {
  final GameViewModel vm;

  const HeaderWidget({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: [
          // Top Navigation Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Logo & Mode badge
              Row(
                children: [
                  IconButton(
                    onPressed: vm.pauseGame,
                    icon: const Icon(Icons.pause_circle_filled_rounded, color: Color(0xFF38BDF8), size: 30),
                    tooltip: 'Pause',
                  ),
                  const SizedBox(width: 4),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'BLOCKBUSTERS',
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.5,
                          foreground: Paint()
                            ..shader = const LinearGradient(
                              colors: [Color(0xFF38BDF8), Color(0xFFA855F7)],
                            ).createShader(const Rect.fromLTWH(0.0, 0.0, 200.0, 70.0)),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: vm.currentMode.badgeColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: vm.currentMode.badgeColor.withValues(alpha: 0.6),
                            width: 1,
                          ),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(vm.currentMode.icon, size: 11, color: vm.currentMode.badgeColor),
                            const SizedBox(width: 4),
                            Text(
                              vm.currentMode.title.toUpperCase(),
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                                color: vm.currentMode.badgeColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // Timer / Streak status
              Row(
                children: [
                  if (vm.timeLeft != null)
                    Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        color: (vm.timeLeft! <= 10 ? const Color(0xFFE11D48) : const Color(0xFF1E293B)).withValues(alpha: 0.9),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: vm.timeLeft! <= 10 ? const Color(0xFFF43F5E) : const Color(0xFF64748B),
                          width: 1.2,
                        ),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.timer_outlined, size: 14, color: Colors.white),
                          const SizedBox(width: 4),
                          Text(
                            '${vm.timeLeft}s',
                            style: GoogleFonts.spaceGrotesk(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                  if (vm.comboStreak > 1)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFF59E0B), Color(0xFFEF4444)],
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.orange.withValues(alpha: 0.5),
                            blurRadius: 10,
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.local_fire_department_rounded, size: 14, color: Colors.white),
                          const SizedBox(width: 3),
                          Text(
                            '${vm.comboStreak}x',
                            style: GoogleFonts.spaceGrotesk(
                              color: Colors.white,
                              fontWeight: FontWeight.w800,
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 12),

          // Score & High Score Banner
          Row(
            children: [
              // Current Score
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFF38BDF8).withValues(alpha: 0.25),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Text(
                        'SCORE',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF94A3B8),
                          letterSpacing: 1.2,
                        ),
                      ),
                      Text(
                        '${vm.score}',
                        style: GoogleFonts.outfit(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Best Score
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.8),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: const Color(0xFFA855F7).withValues(alpha: 0.25),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.emoji_events_rounded, size: 12, color: Color(0xFFFBBF24)),
                          const SizedBox(width: 4),
                          Text(
                            'BEST',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFFFBBF24),
                              letterSpacing: 1.2,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        '${vm.currentBestScore}',
                        style: GoogleFonts.outfit(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: const Color(0xFFFBBF24),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
