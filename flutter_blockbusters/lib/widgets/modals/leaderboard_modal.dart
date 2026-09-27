import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/user_profile.dart';
import '../../services/storage_service.dart';
import '../../viewmodels/game_viewmodel.dart';

class LeaderboardModal extends StatefulWidget {
  final GameViewModel vm;

  const LeaderboardModal({super.key, required this.vm});

  @override
  State<LeaderboardModal> createState() => _LeaderboardModalState();
}

class _LeaderboardModalState extends State<LeaderboardModal> {
  String _selectedMode = 'CLASSIC';
  List<GameRecord> _records = [];

  @override
  void initState() {
    super.initState();
    _records = StorageService.getRecentGames();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _records.where((r) => r.mode == _selectedMode).toList()
      ..sort((a, b) => b.score.compareTo(a.score));

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 440, maxHeight: 560),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF0F172A),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: const Color(0xFFFBBF24).withValues(alpha: 0.4),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFFFBBF24).withValues(alpha: 0.1),
              blurRadius: 30,
            ),
          ],
        ),
        child: Column(
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.emoji_events_rounded, color: Color(0xFFFBBF24), size: 24),
                    const SizedBox(width: 8),
                    Text(
                      'HALL OF FAME',
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
                  onPressed: widget.vm.closeModal,
                  icon: const Icon(Icons.close_rounded, color: Color(0xFF94A3B8)),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Mode Tabs
            Row(
              children: ['CLASSIC', 'TIME_ATTACK', 'ENDLESS'].map((mode) {
                final isSelected = _selectedMode == mode;
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedMode = mode),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFFBBF24).withValues(alpha: 0.2) : const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected ? const Color(0xFFFBBF24) : Colors.transparent,
                          width: 1,
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        mode.replaceAll('_', ' '),
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? const Color(0xFFFBBF24) : const Color(0xFF94A3B8),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 14),

            // Scores List
            Expanded(
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.videogame_asset_off_rounded, size: 40, color: Color(0xFF475569)),
                          const SizedBox(height: 8),
                          Text(
                            'No games recorded for this mode yet.',
                            style: GoogleFonts.spaceGrotesk(color: const Color(0xFF64748B), fontSize: 13),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: filtered.length,
                      itemBuilder: (context, idx) {
                        final rec = filtered[idx];
                        final rank = idx + 1;

                        Color rankColor = const Color(0xFF94A3B8);
                        if (rank == 1) rankColor = const Color(0xFFFBBF24); // Gold
                        if (rank == 2) rankColor = const Color(0xFF94A3B8); // Silver
                        if (rank == 3) rankColor = const Color(0xFFCD7F32); // Bronze

                        return Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B).withValues(alpha: 0.6),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: rank == 1 ? const Color(0xFFFBBF24).withValues(alpha: 0.4) : const Color(0xFF334155),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 26,
                                height: 26,
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  color: rankColor.withValues(alpha: 0.15),
                                  shape: BoxShape.circle,
                                ),
                                child: Text(
                                  '$rank',
                                  style: GoogleFonts.outfit(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w800,
                                    color: rankColor,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      rec.username,
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.white,
                                      ),
                                    ),
                                    Text(
                                      'Lines: ${rec.linesCleared} • Streak: ${rec.highestCombo}x',
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 11,
                                        color: const Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '${rec.score}',
                                style: GoogleFonts.outfit(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: rank == 1 ? const Color(0xFFFBBF24) : Colors.white,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
