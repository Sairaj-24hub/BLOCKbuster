import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class HowToPlayModal extends StatelessWidget {
  final GameViewModel vm;

  const HowToPlayModal({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420, maxHeight: 560),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFF38BDF8).withValues(alpha: 0.35),
            width: 1.5,
          ),
        ),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'HOW TO PLAY',
                  style: GoogleFonts.outfit(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 1.2,
                  ),
                ),
                IconButton(
                  onPressed: vm.closeModal,
                  icon: const Icon(Icons.close_rounded, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
            const SizedBox(height: 14),

            Expanded(
              child: ListView(
                children: const [
                  _RuleStep(
                    number: '1',
                    title: 'Drag & Place Polyominos',
                    description: 'Pick blocks from the lower tray and drag them onto the 10x10 board grid.',
                    color: Color(0xFF38BDF8),
                  ),
                  _RuleStep(
                    number: '2',
                    title: 'Clear Full Rows & Columns',
                    description: 'Fill an entire horizontal row or vertical column to shatter the blocks and earn points.',
                    color: Color(0xFF10B981),
                  ),
                  _RuleStep(
                    number: '3',
                    title: 'Build Massive Combos',
                    description: 'Clear lines on consecutive moves to chain combo multipliers up to 5x!',
                    color: Color(0xFFF97316),
                  ),
                  _RuleStep(
                    number: '4',
                    title: 'Avoid Gridlock',
                    description: 'The game ends when none of the 3 available shapes can fit into the remaining spaces.',
                    color: Color(0xFFEC4899),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RuleStep extends StatelessWidget {
  final String number;
  final String title;
  final String description;
  final Color color;

  const _RuleStep({
    required this.number,
    required this.title,
    required this.description,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: color.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Text(
              number,
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: color,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  description,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 12,
                    color: const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
