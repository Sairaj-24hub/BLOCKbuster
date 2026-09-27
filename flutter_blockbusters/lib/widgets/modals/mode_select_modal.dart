import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../constants/game_config.dart';
import '../../viewmodels/game_viewmodel.dart';

class ModeSelectModal extends StatelessWidget {
  final GameViewModel vm;

  const ModeSelectModal({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420),
        padding: const EdgeInsets.all(20),
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
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'SELECT MODE',
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
            const SizedBox(height: 16),

            // Mode List
            ...GameConfig.modes.values.map((mode) {
              final isSelected = vm.currentMode.id == mode.id;

              return GestureDetector(
                onTap: () => vm.selectMode(mode),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? mode.badgeColor.withValues(alpha: 0.15)
                        : const Color(0xFF1E293B).withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected
                          ? mode.badgeColor
                          : const Color(0xFF334155),
                      width: isSelected ? 1.8 : 1.0,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: mode.badgeColor.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(mode.icon, color: mode.badgeColor, size: 24),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mode.title,
                              style: GoogleFonts.outfit(
                                fontSize: 16,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              mode.subtitle,
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 11,
                                color: const Color(0xFF94A3B8),
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        Icon(Icons.check_circle_rounded, color: mode.badgeColor, size: 22),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
