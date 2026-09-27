import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class SettingsModal extends StatelessWidget {
  final GameViewModel vm;

  const SettingsModal({super.key, required this.vm});

  @override
  Widget build(BuildContext context) {
    final settings = vm.settings;

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 420, maxHeight: 600),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFFA855F7).withValues(alpha: 0.4),
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
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.settings_rounded, color: Color(0xFFA855F7), size: 24),
                    const SizedBox(width: 8),
                    Text(
                      'SETTINGS',
                      style: GoogleFonts.outfit(
                        fontSize: 20,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
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
                children: [
                  // SFX Switch
                  _SettingSwitch(
                    title: 'Sound Effects (SFX)',
                    subtitle: 'Haptic and placement feedback',
                    value: settings.sfxEnabled,
                    onChanged: (val) {
                      vm.updateSettings(settings.copyWith(sfxEnabled: val));
                    },
                  ),

                  // BGM Switch
                  _SettingSwitch(
                    title: 'Background Music',
                    subtitle: 'Arcade synthesized ambience',
                    value: settings.bgmEnabled,
                    onChanged: (val) {
                      vm.updateSettings(settings.copyWith(bgmEnabled: val));
                    },
                  ),

                  // Particles Switch
                  _SettingSwitch(
                    title: 'Cyberpunk Particles',
                    subtitle: 'Ambient glowing background specks',
                    value: settings.enableFallingParticles,
                    onChanged: (val) {
                      vm.updateSettings(settings.copyWith(enableFallingParticles: val));
                    },
                  ),

                  const SizedBox(height: 14),

                  // Starter Obstacles Picker
                  Text(
                    'STARTER OBSTACLES DENSITY',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF94A3B8),
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),

                  Row(
                    children: ['NONE', 'LIGHT', 'MEDIUM', 'HARDCORE'].map((density) {
                      final isSelected = settings.starterObstacles == density;
                      return Expanded(
                        child: GestureDetector(
                          onTap: () {
                            vm.updateSettings(settings.copyWith(starterObstacles: density));
                          },
                          child: Container(
                            padding: const EdgeInsets.symmetric(vertical: 8),
                            margin: const EdgeInsets.symmetric(horizontal: 2),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFFA855F7).withValues(alpha: 0.25) : const Color(0xFF1E293B),
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(
                                color: isSelected ? const Color(0xFFA855F7) : const Color(0xFF334155),
                                width: 1,
                              ),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              density,
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                color: isSelected ? const Color(0xFFA855F7) : const Color(0xFF94A3B8),
                              ),
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  // Reset All Data Button
                  OutlinedButton.icon(
                    onPressed: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: const Color(0xFF0F172A),
                          title: Text('Reset All Data?', style: GoogleFonts.outfit(color: Colors.white)),
                          content: Text(
                            'This will erase your high scores, records, and player profile.',
                            style: GoogleFonts.spaceGrotesk(color: const Color(0xFF94A3B8)),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.pop(ctx, false),
                              child: const Text('Cancel'),
                            ),
                            ElevatedButton(
                              onPressed: () => Navigator.pop(ctx, true),
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFF43F5E)),
                              child: const Text('Reset', style: TextStyle(color: Colors.white)),
                            ),
                          ],
                        ),
                      );

                      if (confirm == true) {
                        await vm.resetAllData();
                      }
                    },
                    icon: const Icon(Icons.delete_forever_rounded, color: Color(0xFFF43F5E), size: 18),
                    label: Text(
                      'RESET ALL PROGRESS',
                      style: GoogleFonts.outfit(
                        color: const Color(0xFFF43F5E),
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFF43F5E), width: 1.2),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
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

class _SettingSwitch extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  const _SettingSwitch({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B).withValues(alpha: 0.6),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: const Color(0xFF334155),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 11,
                    color: const Color(0xFF94A3B8),
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: const Color(0xFFA855F7),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}
