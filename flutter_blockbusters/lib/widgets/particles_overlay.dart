import 'dart:math';
import 'package:flutter/material.dart';

class AmbientParticlesWidget extends StatefulWidget {
  const AmbientParticlesWidget({super.key});

  @override
  State<AmbientParticlesWidget> createState() => _AmbientParticlesWidgetState();
}

class _AmbientParticlesWidgetState extends State<AmbientParticlesWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final List<_Particle> _particles = [];
  final Random _rand = Random();

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 10))
      ..repeat();

    for (var i = 0; i < 35; i++) {
      _particles.add(_Particle(
        x: _rand.nextDouble(),
        y: _rand.nextDouble(),
        size: _rand.nextDouble() * 3.5 + 1.5,
        speed: _rand.nextDouble() * 0.15 + 0.05,
        opacity: _rand.nextDouble() * 0.4 + 0.1,
        color: [
          const Color(0xFF38BDF8),
          const Color(0xFFA855F7),
          const Color(0xFFEC4899),
          const Color(0xFF10B981),
        ][_rand.nextInt(4)],
      ));
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: Size.infinite,
          painter: _ParticlePainter(_particles, _controller.value),
        );
      },
    );
  }
}

class _Particle {
  double x;
  double y;
  double size;
  double speed;
  double opacity;
  Color color;

  _Particle({
    required this.x,
    required this.y,
    required this.size,
    required this.speed,
    required this.opacity,
    required this.color,
  });
}

class _ParticlePainter extends CustomPainter {
  final List<_Particle> particles;
  final double progress;

  _ParticlePainter(this.particles, this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in particles) {
      final currentY = (p.y + (progress * p.speed)) % 1.0;
      final offset = Offset(p.x * size.width, currentY * size.height);

      final paint = Paint()
        ..color = p.color.withValues(alpha: p.opacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(offset, p.size, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
