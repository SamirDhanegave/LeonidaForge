import React from 'react';

import {
  ArrowRight,
  Compass,
  Layers3,
  Newspaper,
  Sparkles,
  Wrench,
} from 'lucide-react';

import { Link } from '../../services/router';

// =============================================================
// Animated network background
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

        // Soft wrapping
        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;

        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;

        // Mouse interaction
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

        // Smoothly return to natural movement
        point.vx += (point.baseVx - point.vx) * 0.01;
        point.vy += (point.baseVy - point.vy) * 0.01;
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) return;

      // IMPORTANT:
      // Clear only. Do NOT paint a dark background here.
      // This keeps background.png visible underneath.
      ctx.clearRect(0, 0, width, height);

      // Mouse glow
      if (mouse.active) {
        const glow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          220,
        );

        glow.addColorStop(0, 'rgba(255,255,255,0.08)');
        glow.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw connections
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

      // Draw nodes
      for (const point of points) {
        ctx.beginPath();

        ctx.arc(
          point.x,
          point.y,
          point.radius,
          0,
          Math.PI * 2,
        );

        ctx.fillStyle = 'rgba(255,255,255,0.65)';
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
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />
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
        className="relative overflow-hidden border-b border-[#1e2434] bg-transparent"
      >

        {/* =====================================================
            MOVING NODE / NETWORK GRAPH
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0">
          <InteractiveNetworkBackground />
        </div>

        {/* =====================================================
            COLOR GLOWS
        ====================================================== */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#c8f135]/[0.06] blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#f472b6]/[0.05] blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-10rem] left-1/2 h-[20rem] w-[32rem] -translate-x-1/2 rounded-full bg-[#8b5cf6]/[0.04] blur-3xl" />

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex min-h-[78vh] items-center py-20 sm:py-24 lg:py-28">

            <div className="w-full">

              {/* Badge */}
              <div className="flex justify-center lg:justify-start">

                <div className="inline-flex items-center gap-2 rounded-full border border-[#273145] bg-[#11151d]/90 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#c8f135] shadow-[0_0_20px_rgba(200,241,53,0.05)]">

                  <Sparkles className="h-3.5 w-3.5" />

                  <span>
                    AN INDEPENDENT GTA VI FAN PROJECT
                  </span>

                </div>

              </div>

              {/* Main content */}
              <div className="mt-7 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

                {/* =================================================
                    LEFT
                ================================================== */}

                <div className="text-center lg:text-left">

                  <h1 className="text-5xl font-black leading-[0.92] tracking-[-0.045em] text-[#f8fafc] sm:text-6xl md:text-7xl lg:text-8xl">

                    LEONIDA

                    <span className="block text-[#c8f135] drop-shadow-[0_0_25px_rgba(200,241,53,0.12)]">
                      FORGE
                    </span>

                  </h1>

                  <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-[#d8dee9] sm:text-xl lg:mx-0 lg:text-2xl">
                    A growing collection of tools, experiments, information,
                    and community-focused features built around GTA VI.
                  </p>

                  <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#8490a5] sm:text-base lg:mx-0">
                    Explore useful tools, discover new features, follow what's
                    happening around GTA VI, and see what the Forge has to
                    offer.
                  </p>

                  {/* CTA */}
                  <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

                    <Link
                      to="/money"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#c8f135] px-6 py-3.5 text-sm font-bold text-[#0a0c10] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(200,241,53,0.25)]"
                    >

                      <Wrench className="h-4 w-4" />

                      <span>
                        Explore Tools
                      </span>

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                    </Link>

                    <Link
                      to="/waitlist"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl border border-[#2b3447] bg-[#11151d]/80 px-6 py-3.5 text-sm font-bold text-[#f8fafc] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#46546c] hover:bg-[#161b25]"
                    >

                      <Newspaper className="h-4 w-4 text-[#c8f135]" />

                      <span>
                        Join Waitlist
                      </span>

                      <ArrowRight className="h-4 w-4 text-[#8490a5] transition-transform group-hover:translate-x-1" />

                    </Link>

                  </div>

                  {/* Mini stats */}
                  <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wide text-[#68758b] sm:text-xs lg:justify-start">

                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c8f135] shadow-[0_0_8px_rgba(200,241,53,0.8)]" />
                      Tools
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f472b6] shadow-[0_0_8px_rgba(244,114,182,0.8)]" />
                      News
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                      Community
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                      Experiments
                    </span>

                  </div>

                </div>

                {/* =================================================
                    RIGHT
                ================================================== */}

                <div className="relative mx-auto w-full max-w-xl lg:ml-auto">

                  <div className="relative rounded-3xl border border-[#252e40] bg-[#0f131b]/85 p-4 shadow-2xl backdrop-blur-xl sm:p-5">

                    {/* Window header */}
                    <div className="flex items-center justify-between px-2 pb-4">

                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#394355]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#394355]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#394355]" />
                      </div>

                      <div className="font-mono text-[10px] text-[#59667b]">
                        LEONIDA.FORGE
                      </div>

                    </div>

                    {/* Explore Forge panel */}
                    <div className="relative overflow-hidden rounded-2xl border border-[#202838] bg-gradient-to-br from-[#171d27]/95 via-[#10151d]/95 to-[#0c0f15]/95">

                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,241,53,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.08),transparent_30%)]" />

                      <div className="relative p-5 sm:p-7">

                        {/* Header */}
                        <div className="flex items-center justify-between">

                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#67758c]">
                            Explore the Forge
                          </span>

                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2a3447] bg-[#111620] px-2.5 py-1 text-[9px] font-semibold text-[#c8f135] shadow-[0_0_15px_rgba(200,241,53,0.1)]">

                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c8f135] shadow-[0_0_8px_rgba(200,241,53,0.9)]" />

                            ACTIVE

                          </span>

                        </div>

                        {/* Four sections */}
                        <div className="mt-8">

                          <div className="grid grid-cols-2 gap-3">

                            {/* =================================================
                                TOOLS
                            ================================================== */}

                            <div className="group relative overflow-hidden rounded-2xl border border-[#c8f135]/40 bg-[#141922]/95 p-4 shadow-[0_0_24px_rgba(200,241,53,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8f135]/80 hover:shadow-[0_0_40px_rgba(200,241,53,0.28)]">

                              <div className="absolute inset-0 bg-[#c8f135]/[0.035] opacity-100 transition-opacity group-hover:bg-[#c8f135]/[0.07]" />

                              <Wrench className="relative h-5 w-5 text-[#c8f135] drop-shadow-[0_0_9px_rgba(200,241,53,0.95)] transition-transform duration-300 group-hover:scale-110" />

                              <div className="relative mt-5 text-sm font-bold text-[#f8fafc]">
                                Tools
                              </div>

                              <p className="relative mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Useful interactive experiences.
                              </p>

                            </div>

                            {/* =================================================
                                NEWS
                            ================================================== */}

                            <div className="group relative overflow-hidden rounded-2xl border border-[#f472b6]/40 bg-[#141922]/95 p-4 shadow-[0_0_24px_rgba(244,114,182,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#f472b6]/80 hover:shadow-[0_0_40px_rgba(244,114,182,0.28)]">

                              <div className="absolute inset-0 bg-[#f472b6]/[0.035] opacity-100 transition-opacity group-hover:bg-[#f472b6]/[0.07]" />

                              <Newspaper className="relative h-5 w-5 text-[#f472b6] drop-shadow-[0_0_9px_rgba(244,114,182,0.95)] transition-transform duration-300 group-hover:scale-110" />

                              <div className="relative mt-5 text-sm font-bold text-[#f8fafc]">
                                News
                              </div>

                              <p className="relative mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Follow GTA VI developments.
                              </p>

                            </div>

                            {/* =================================================
                                FEATURES
                            ================================================== */}

                            <div className="group relative overflow-hidden rounded-2xl border border-[#8b5cf6]/40 bg-[#141922]/95 p-4 shadow-[0_0_24px_rgba(139,92,246,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8b5cf6]/80 hover:shadow-[0_0_40px_rgba(139,92,246,0.28)]">

                              <div className="absolute inset-0 bg-[#8b5cf6]/[0.035] opacity-100 transition-opacity group-hover:bg-[#8b5cf6]/[0.07]" />

                              <Layers3 className="relative h-5 w-5 text-[#8b5cf6] drop-shadow-[0_0_9px_rgba(139,92,246,0.95)] transition-transform duration-300 group-hover:scale-110" />

                              <div className="relative mt-5 text-sm font-bold text-[#f8fafc]">
                                Features
                              </div>

                              <p className="relative mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                More experiences are being built.
                              </p>

                            </div>

                            {/* =================================================
                                EXPLORE
                            ================================================== */}

                            <div className="group relative overflow-hidden rounded-2xl border border-[#38bdf8]/40 bg-[#141922]/95 p-4 shadow-[0_0_24px_rgba(56,189,248,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#38bdf8]/80 hover:shadow-[0_0_40px_rgba(56,189,248,0.28)]">

                              <div className="absolute inset-0 bg-[#38bdf8]/[0.035] opacity-100 transition-opacity group-hover:bg-[#38bdf8]/[0.07]" />

                              <Compass className="relative h-5 w-5 text-[#38bdf8] drop-shadow-[0_0_9px_rgba(56,189,248,0.95)] transition-transform duration-300 group-hover:scale-110" />

                              <div className="relative mt-5 text-sm font-bold text-[#f8fafc]">
                                Explore
                              </div>

                              <p className="relative mt-1 text-[11px] leading-relaxed text-[#6e7a90]">
                                Find something new to use.
                              </p>

                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative accents */}
                  <div className="absolute -bottom-4 -right-4 -z-10 h-28 w-28 rounded-3xl border border-[#c8f135]/15" />

                  <div className="absolute -left-4 -top-4 -z-10 h-20 w-20 rounded-2xl border border-[#f472b6]/10" />

                </div>

              </div>

              {/* Scroll hint */}
              <div className="mt-12 flex justify-center sm:mt-16 lg:justify-start">

                <a
                  href="#about"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#58667a] transition-colors hover:text-[#c8f135]"
                >
                  <span>
                    Discover Leonida Forge
                  </span>

                  <ArrowRight className="h-3.5 w-3.5" />
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
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

            {/* Heading */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#273145] bg-[#11151d] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#c8f135]">

                <Compass className="h-3.5 w-3.5" />

                About the Project

              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#f8fafc] sm:text-4xl lg:text-5xl">

                Built to be

                <span className="text-[#c8f135]">
                  {' '}explored.
                </span>

              </h2>

            </div>

            {/* Content */}
            <div className="space-y-5">

              <p className="text-base leading-relaxed text-[#d4dae4] sm:text-lg">
                Leonida Forge is an independent GTA VI fan project built as a
                collection of useful tools, information, experiments, and
                community-focused features.
              </p>

              <p className="text-sm leading-relaxed text-[#818da1] sm:text-base">
                It isn't designed around a single feature. The Forge is meant
                to grow over time, with new ideas and experiences being added
                as the project develops.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-2">

                <div className="rounded-2xl border border-[#202938] bg-[#10141b] p-5">

                  <Wrench className="h-5 w-5 text-[#c8f135]" />

                  <h3 className="mt-4 text-sm font-bold text-[#f8fafc]">
                    Useful tools
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#748095]">
                    Interactive features designed to make exploring GTA VI
                    information easier.
                  </p>

                </div>

                <div className="rounded-2xl border border-[#202938] bg-[#10141b] p-5">

                  <Sparkles className="h-5 w-5 text-[#f472b6]" />

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

                  <span>
                    Learn more about Leonida Forge
                  </span>

                  <ArrowRight className="h-4 w-4" />

                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};