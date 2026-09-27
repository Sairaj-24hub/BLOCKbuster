import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class HomeScreenWidget extends StatelessWidget {
  final GameViewModel vm;

  const HomeScreenWidget({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    final profile = vm.profile;

    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 440),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Player profile chip
              if (profile != null)
                GestureDetector(
                  onTap: () => vm.openModal(ActiveModal.username),
                  child: Container(
                    margin: const EdgeInsets.bottom: 24,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B).withOpacity(0.8),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: const Color(0xFF38BDF8).withOpacity(0.3),
                        width: 1.2,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(profile.avatar, style: const TextStyle(fontSize: 18)),
                        const SizedBox(width: 8),
                        Text(
                          profile.username,
                          style: GoogleFonts.spaceGrotesk(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.edit_rounded, color: Color(0xFF94A3B8), size: 14),
                      ],
                    ),
                  ),
                ),

              // Title Logo
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const RadialGradient(
                    colors: [Color(0x336366F1), Colors.transparent],
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      'BLOCKBUSTERS',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.outfit(
                        fontSize: 38,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2.0,
                        foreground: Paint()
                          ..shader = const LinearGradient(
                            colors: [Color(0xFF38BDF8), Color(0xFFA855F7), Color(0xFFEC4899)],
                          ).createShader(const Rect.fromLTWH(0.0, 0.0, 350.0, 70.0)),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '3D ARCADE PUZZLE',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF94A3B8),
                        letterSpacing: 4.0,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 28),

              // Mode preview card
              GestureDetector(
                onTap: () => vm.openModal(ActiveModal.modes),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.9),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: vm.currentMode.badgeColor.withValues(alpha: 0.4),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: vm.currentMode.badgeColor.withValues(alpha: 0.15),
                        blurRadius: 18,
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: vm.currentMode.badgeColor.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(vm.currentMode.icon, color: vm.currentMode.badgeColor, size: 28),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  vm.currentMode.title,
                                  style: GoogleFonts.outfit(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
                                ),
                                Text(
                                  'CHANGE',
                                  style: GoogleFonts.spaceGrotesk(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: vm.currentMode.badgeColor,
                                    letterSpacing: 1.2,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              vm.currentMode.subtitle,
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
                ),
              ),

              const SizedBox(height: 32),

              // Play button
              SizedBox(
                width: double.infinity,
                height: 58,
                child: ElevatedButton(
                  onPressed: () => vm.startNewGame(),
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.zero,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    elevation: 10,
                    shadowColor: const Color(0xFF6366F1).withValues(alpha: 0.6),
                  ),
                  child: Ink(
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF6366F1), Color(0xFFA855F7)],
                      ),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Container(
                      alignment: Alignment.center,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 30),
                          const SizedBox(width: 8),
                          Text(
                            'PLAY NOW',
                            style: GoogleFonts.outfit(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              letterSpacing: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // Secondary Quick Action Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _QuickButton(
                    icon: Icons.leaderboard_rounded,
                    label: 'Leaderboard',
                    color: const Color(0xFFFBBF24),
                    onTap: () => vm.openModal(ActiveModal.leaderboard),
                  ),
                  _QuickButton(
                    icon: Icons.help_outline_rounded,
                    label: 'How to Play',
                    color: const Color(0xFF38BDF8),
                    onTap: () => vm.openModal(ActiveModal.howToPlay),
                  ),
                  _QuickButton(
                    icon: Icons.settings_rounded,
                    label: 'Settings',
                    color: const Color(0xFFA855F7),
                    onTap: () => vm.openModal(ActiveModal.settings),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuickButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B).withValues(alpha: 0.8),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: color.withValues(alpha: 0.4),
                width: 1.2,
              ),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: const Color(0xFFCBD5E1),
            ),
          ),
        ],
      ),
    );
  }
}
