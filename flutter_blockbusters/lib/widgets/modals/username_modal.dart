import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../viewmodels/game_viewmodel.dart';

class UsernameModal extends StatefulWidget {
  final GameViewModel vm;

  const UsernameModal({super.key, required this.vm});

  @override
  State<UsernameModal> createState() => _UsernameModalState();
}

class _UsernameModalState extends State<UsernameModal> {
  late TextEditingController _controller;
  String _selectedAvatar = '⚡';

  final List<String> _avatars = ['⚡', '🔥', '💎', '🚀', '👑', '👾', '🌟', '🎯'];

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.vm.profile?.username ?? 'Player 1');
    _selectedAvatar = widget.vm.profile?.avatar ?? '⚡';
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

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
            color: const Color(0xFF38BDF8).withValues(alpha: 0.4),
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'PLAYER PROFILE',
              style: GoogleFonts.outfit(
                fontSize: 20,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Choose your avatar and player handle',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 12,
                color: const Color(0xFF94A3B8),
              ),
            ),
            const SizedBox(height: 18),

            // Avatars Grid
            Text(
              'SELECT AVATAR',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF38BDF8),
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),

            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _avatars.map((av) {
                final isSelected = _selectedAvatar == av;
                return GestureDetector(
                  onTap: () => setState(() => _selectedAvatar = av),
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFF38BDF8).withValues(alpha: 0.25) : const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF38BDF8) : const Color(0xFF334155),
                        width: isSelected ? 2 : 1,
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Text(av, style: const TextStyle(fontSize: 22)),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 18),

            // Username input
            Text(
              'PLAYER NAME',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF38BDF8),
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 8),

            TextField(
              controller: _controller,
              maxLength: 16,
              style: GoogleFonts.spaceGrotesk(color: Colors.white, fontWeight: FontWeight.w700),
              decoration: InputDecoration(
                filled: true,
                fillColor: const Color(0xFF1E293B),
                counterText: '',
                hintText: 'Enter name...',
                hintStyle: GoogleFonts.spaceGrotesk(color: const Color(0xFF64748B)),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF334155)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFF38BDF8), width: 1.5),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Save button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  widget.vm.updateProfile(_controller.text, _selectedAvatar);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6366F1),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  'SAVE PROFILE',
                  style: GoogleFonts.outfit(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.2,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
