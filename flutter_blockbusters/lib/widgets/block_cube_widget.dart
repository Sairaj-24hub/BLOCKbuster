import 'package:flutter/material.dart';

class BlockCubeWidget extends StatelessWidget {
  final Color color;
  final Color topColor;
  final Color frontColor;
  final Color rightColor;
  final Color glowColor;
  final double size;
  final bool isGhost;
  final bool isClearing;

  const BlockCubeWidget({
    super.key,
    required this.color,
    required this.topColor,
    required this.frontColor,
    required this.rightColor,
    required this.glowColor,
    required this.size,
    this.isGhost = false,
    this.isClearing = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isGhost) {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.35),
          borderRadius: BorderRadius.circular(size * 0.18),
          border: Border.all(
            color: topColor.withValues(alpha: 0.8),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: glowColor.withValues(alpha: 0.3),
              blurRadius: 8,
              spreadRadius: 1,
            ),
          ],
        ),
      );
    }

    return AnimatedScale(
      scale: isClearing ? 1.15 : 1.0,
      duration: const Duration(milliseconds: 180),
      child: AnimatedOpacity(
        opacity: isClearing ? 0.0 : 1.0,
        duration: const Duration(milliseconds: 250),
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(size * 0.18),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                topColor,
                frontColor,
                rightColor,
              ],
              stops: const [0.0, 0.45, 1.0],
            ),
            boxShadow: [
              BoxShadow(
                color: glowColor.withValues(alpha: 0.55),
                blurRadius: size * 0.35,
                spreadRadius: 1,
                offset: const Offset(0, 2),
              ),
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.4),
                blurRadius: 3,
                offset: const Offset(0, 2),
              ),
            ],
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.25),
              width: 0.8,
            ),
          ),
          child: Stack(
            children: [
              // Top-left glossy highlight
              Positioned(
                top: size * 0.1,
                left: size * 0.1,
                width: size * 0.35,
                height: size * 0.35,
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.35),
                    borderRadius: BorderRadius.circular(size * 0.1),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
