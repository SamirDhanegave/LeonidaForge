import React from 'react';
import {
  ArrowRight,
  Compass,
  Layers3,
  Newspaper,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from '../../services/router';

// =============================================================
// Background animation
// =============================================================
const InteractiveNetworkBackground: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = {
      x: 0,
      y: 0,
      active: false,
    };

    type Point = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseVx: number;
      baseVy: number;
      radius: number;
    };

    let points: Point[] = [];

    const createPoints = () => {
      const area = width * height;

      // Automatically adapts the number of points to the screen size.
      const count = Math.max(
        24,
        Math.min(70, Math.floor(area / 18000)),
      );

      points = Array.from({ length: count }, () => {
        const vx = (Math.random() - 0.5) * 0.18;
        const vy = (Math.random() - 0.5) * 0.18;

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          radius: Math.random() * 1.5 + 0.5,
        };
      });
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();

      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Guard against a zero-size container on first paint (e.g. before
      // layout has settled), which would otherwise leave the canvas
      // with no backing store and nothing would ever draw.
      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createPoints();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
    };

    const update = () => {
      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        // Soft wrapping instead of hard bouncing.
        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;

        if (mouse.active) {
          const dx = point.x - mouse.x;
          const dy = point.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const influence = 150;

          if (distance < influence && distance > 0) {
            const force = (1 - distance / influence) * 0.018;

            point.vx += (dx / distance) * force;
            point.vy += (dy / distance) * force;
          }
        }

        // Slowly return to natural movement.
        point.vx += (point.baseVx - point.vx) * 0.01;
        point.vy += (point.baseVy - point.vy) * 0.01;
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      // Dark background.
      ctx.fillStyle = '#07090d';
      ctx.fillRect(0, 0, width, height);

      // Subtle radial glow around pointer.
      if (mouse.active) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          220,
        );

        glow.addColorStop(0, 'rgba(255,255,255,0.055)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw connections.
      for (let i = 0; i < points.length; i++) {
        const a = points[i];

        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const maxDistance = 145;

          if (distance > maxDistance) continue;

          const opacity =
            (1 - distance / maxDistance) * 0.24;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);

          ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Draw points.
      for (const point of points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);

        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
    };

    const animate = () => {
      update();
      draw();
      animationFrame = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(container);

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      canvas.removeEventListener(
        'pointermove',
        handlePointerMove,
      );

      canvas.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      {/* Soft readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#090b10]/80" />
    </div>
  );
};

// =============================================================
// Hero
// =============================================================
export const Hero: React.FC = () => {
  return (
    <div className="w-full">
      {/* =========================================================
          HERO SECTION
      ========================================================== */}
      <section
        id="hero"
        className="relative overflow-hidden border-b border-[#1e2434]"
      >
        {/*
          Background layer: the animated canvas is now actually mounted
          and rendered here (it was previously defined but never used).
          It sits at the very bottom of the stack and keeps
          `pointer-events` enabled so the pointermove/pointerleave
          listeners it attaches to the canvas actually fire.
        */}
        <InteractiveNetworkBackground />

        {/*
          Decorative color glows. These sit above the canvas but must
          stay `pointer-events-none`, otherwise they'd form an invisible
          layer blocking the mouse from ever reaching the canvas.
        */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#c8f135]/[0.07] blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-[-8rem] w-96 h-96 rounded-full bg-[#f472b6]/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 -translate-x-1/2 w-[32rem] h-[20rem] rounded-full bg-[#8b5cf6]/[0.05] blur-3xl" />

        {/* Subtle grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        {/*
          Content layer. It's `pointer-events-none` as a whole so the
          canvas underneath keeps receiving mouse movement everywhere
          text/whitespace covers it; only the actual clickable elements
          (links) opt back in with `pointer-events-auto`.
        */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="min-h-[78vh] flex items-center py-20 sm:py-24 lg:py-28">
            <div className="w-full">
              {/* Small badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#273145] bg-[#11151d]/90 px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold tracking-wide text-[#c8f135]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AN INDEPENDENT GTA VI FAN PROJECT</span>
                </div>
              </div>

              {/* Main content */}
              <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                {/* Left */}
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.045em] leading-[0.92] text-[#f8fafc]">
                    LEONIDA
                    <span className="block text-[#c8f135]">FORGE</span>
                  </h1>

                  <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed text-[#d8dee9]">
                    A growing collection of tools, experiments, information,
                    and community-focused features built around GTA VI.
                  </p>

                  <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed text-[#8490a5]">
                    Explore useful tools, discover new features, follow what's
                    happening around GTA VI, and see what the Forge has to
                    offer.
                  </p>

                  {/* CTA buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <Link
                      to="/money"
                      className="pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c8f135] px-6 py-3.5 text-sm font-bold text-[#0a0c10] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(200,241,53,0.18)]"
                    >
                      <Wrench className="w-4 h-4" />
                      <span>Explore Tools</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/news"
                      className="pointer-events-auto group inline-flex items-center justify-center gap-2 rounded-xl border border-[#2b3447] bg-[#11151d]/80 px-6 py-3.5 text-sm font-bold text-[#f8fafc] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#46546c] hover:bg-[#161b25]"
                    >
                      <Newspaper className="w-4 h-4 text-[#c8f135]" />
                      <span>Explore News</span>
                      <ArrowRight className="w-4 h-4 text-[#8490a5] transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                  {/* Mini stats */}
                  <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-[11px] sm:text-xs font-mono uppercase tracking-wide text-[#68758b]">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8f135]" />
                      Tools
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6]" />
                      News
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]" />
                      Community
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
                      Experiments
                    </span>
                  </div>
                </div>

                {/* Right visual panel */}
                <div className="pointer-events-auto relative max-w-xl w-full mx-auto lg:mx-0 lg:ml-auto">
                  <div className="relative rounded-3xl border border-[#252e40] bg-[#0f131b]/90 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                    {/* Fake window header */}
                    <div className="flex items-center justify-between px-2 pb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#394355]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#394355]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#394355]" />
                      </div>

                      <div className="text-[10px] font-mono text-[#59667b]">
                        LEONIDA.FORGE
                      </div>
                    </div>

                    {/* Main visual */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#202838] bg-gradient-to-br from-[#171d27] via-[#10151d] to-[#0c0f15]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,241,53,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.08),transparent_30%)]" />

                      <div className="relative p-5 sm:p-7">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#67758c]">
                            Explore the Forge
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2a3447] bg-[#111620] px-2.5 py-1 text-[9px] font-semibold text-[#c8f135]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c8f135]" />
                            ACTIVE
                          </span>
                        </div>

                        <div className="mt-8">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-[#283143] bg-[#141922]/90 p-4">
                              <Wrench className="w-5 h-5 text-[#c8f135]" />
                              <div className="mt-5 text-sm font-bold text-[#f8fafc]">
                                Tools
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Useful interactive experiences.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[#283143] bg-[#141922]/90 p-4">
                              <Newspaper className="w-5 h-5 text-[#f472b6]" />
                              <div className="mt-5 text-sm font-bold text-[#f8fafc]">
                                News
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Follow GTA VI developments.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[#283143] bg-[#141922]/90 p-4">
                              <Layers3 className="w-5 h-5 text-[#8b5cf6]" />
                              <div className="mt-5 text-sm font-bold text-[#f8fafc]">
                                Features
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                More experiences are being built.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-[#283143] bg-[#141922]/90 p-4">
                              <Compass className="w-5 h-5 text-[#38bdf8]" />
                              <div className="mt-5 text-sm font-bold text-[#f8fafc]">
                                Explore
                              </div>
                              <p className="mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Find something new to use.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative accent */}
                  <div className="absolute -bottom-4 -right-4 w-28 h-28 border border-[#c8f135]/15 rounded-3xl -z-10" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 border border-[#f472b6]/10 rounded-2xl -z-10" />
                </div>
              </div>

              {/* Scroll hint */}
              <div className="mt-12 sm:mt-16 flex justify-center lg:justify-start">
                <a
                  href="#about"
                  className="pointer-events-auto inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#58667a] hover:text-[#c8f135] transition-colors"
                >
                  <span>Discover Leonida Forge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          ABOUT SECTION
      ========================================================== */}
      <section
        id="about"
        className="border-b border-[#1e2434] bg-[#0b0e13]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-20 items-start">
            {/* Heading */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#273145] bg-[#11151d] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c8f135]">
                <Compass className="w-3.5 h-3.5" />
                About the Project
              </div>

              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#f8fafc]">
                Built to be
                <span className="text-[#c8f135]"> explored.</span>
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-5">
              <p className="text-base sm:text-lg leading-relaxed text-[#d4dae4]">
                Leonida Forge is an independent GTA VI fan project built as a
                collection of useful tools, information, experiments, and
                community-focused features.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-[#818da1]">
                It isn't designed around a single feature. The Forge is meant
                to grow over time, with new ideas and experiences being added
                as the project develops.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="rounded-2xl border border-[#202938] bg-[#10141b] p-5">
                  <Wrench className="w-5 h-5 text-[#c8f135]" />
                  <h3 className="mt-4 text-sm font-bold text-[#f8fafc]">
                    Useful tools
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#748095]">
                    Interactive features designed to make exploring GTA VI
                    information easier.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#202938] bg-[#10141b] p-5">
                  <Sparkles className="w-5 h-5 text-[#f472b6]" />
                  <h3 className="mt-4 text-sm font-bold text-[#f8fafc]">
                    Experimental ideas
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#748095]">
                    A place to build, test, and showcase different GTA VI
                    concepts.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#c8f135] hover:underline"
                >
                  <span>Learn more about Leonida Forge</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};