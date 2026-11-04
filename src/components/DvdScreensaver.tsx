import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioService } from '../services/audio';

interface DvdScreensaverProps {
  onEnterApp: () => void;
}

const GLOW_PALETTES = [
  { glow: '#ff007f', border: '#ff3399', text: 'HOT MAGENTA' },
  { glow: '#00f0ff', border: '#33f3ff', text: 'CYBER BLUE' },
  { glow: '#ffe600', border: '#ffea4d', text: 'Y2K GOLD' },
  { glow: '#ff3864', border: '#ff6685', text: 'VELOUR CHERRY' },
  { glow: '#39ff14', border: '#70ff54', text: 'MATRIX ACID' },
];

export const DvdScreensaver: React.FC<DvdScreensaverProps> = ({ onEnterApp }) => {
  const [cornerHits, setCornerHits] = useState(0);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);

  const boxRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Physics state for bouncing DVD logo box
  const pos = useRef({
    x: 80,
    y: 120,
    dx: 2.2,
    dy: 1.8,
    width: 240,
    height: 240,
  });

  const currentPalette = GLOW_PALETTES[paletteIndex];

  // Initialize and run the 2D bouncing box physics loop
  useEffect(() => {
    const updateBounds = () => {
      const maxX = (window.innerWidth || 800) - pos.current.width;
      const maxY = (window.innerHeight || 600) - pos.current.height;
      if (pos.current.x > maxX) pos.current.x = Math.max(0, maxX);
      if (pos.current.y > maxY) pos.current.y = Math.max(0, maxY);
    };

    window.addEventListener('resize', updateBounds);
    pos.current.x = Math.max(20, Math.floor(((window.innerWidth || 800) - pos.current.width) / 2));
    pos.current.y = Math.max(80, Math.floor(((window.innerHeight || 600) - pos.current.height) * 0.3));

    const loop = () => {
      const maxX = (window.innerWidth || 800) - pos.current.width;
      const maxY = (window.innerHeight || 600) - pos.current.height;

      pos.current.x += pos.current.dx;
      pos.current.y += pos.current.dy;

      let hitX = false;
      let hitY = false;

      // Left/Right collisions
      if (pos.current.x <= 10) {
        pos.current.x = 10;
        pos.current.dx = Math.abs(pos.current.dx);
        hitX = true;
      } else if (pos.current.x >= maxX - 10) {
        pos.current.x = maxX - 10;
        pos.current.dx = -Math.abs(pos.current.dx);
        hitX = true;
      }

      // Top/Bottom collisions
      const topLimit = 75;
      const bottomLimit = maxY - 75;
      if (pos.current.y <= topLimit) {
        pos.current.y = topLimit;
        pos.current.dy = Math.abs(pos.current.dy);
        hitY = true;
      } else if (pos.current.y >= bottomLimit) {
        pos.current.y = bottomLimit;
        pos.current.dy = -Math.abs(pos.current.dy);
        hitY = true;
      }

      if (hitX || hitY) {
        setPaletteIndex((prev) => (prev + 1) % GLOW_PALETTES.length);
        const isCorner = hitX && hitY;
        audioService.playBouncingBlip(isCorner ? 880 : 440 + Math.random() * 200);
        if (isCorner) {
          setCornerHits((c) => c + 1);
        }
      }

      if (boxRef.current) {
        boxRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', updateBounds);
    };
  }, []);

  // Handle entry click: Play exact startup synth sound and hyperspace transition
  const handleTriggerEntry = useCallback(() => {
    if (isWarping) return;

    setIsWarping(true);
    // Play the exact dual-oscillator disc startup sound from nailsbysoa.netlify.app
    audioService.playDiscLoadSound();

    setLoadingStep('DISC 01: LOADED • OUVERTURE DU STUDIO NBS');

    setTimeout(() => {
      setLoadingStep('INITIALISATION DE SOA VOICE ATELIER...');
    }, 600);

    setTimeout(() => {
      onEnterApp();
    }, 1100);
  }, [isWarping, onEnterApp]);

  return (
    <div
      id="screensaver-root"
      onClick={handleTriggerEntry}
      className={`crt-screen relative w-screen h-screen flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
        isWarping ? 'open-portal-anim' : ''
      }`}
    >
      {/* CRT Scanline & Vignette Effects */}
      <div className="scanlines" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ff007f_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Floating Retro Starbursts */}
      <div className="sparkle top-1/4 left-1/6">✦</div>
      <div className="sparkle top-2/3 left-1/4">★</div>
      <div className="sparkle top-1/3 right-1/4">✦</div>
      <div className="sparkle bottom-1/4 right-1/3">✧</div>
      <div className="sparkle bottom-1/3 left-1/2">★</div>

      {/* Top Arcade HUD Bar */}
      <header className="relative z-30 p-4 sm:p-6 flex justify-between items-start pointer-events-none">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#39ff14] animate-pulse" />
          <div className="font-pixel text-emerald-400/90 text-lg sm:text-xl tracking-widest">
            [DVD-VIDEO] DISC_01 // PLAYING
          </div>
        </div>

        <div className="text-center bg-black/65 backdrop-blur-md border border-pink-500/40 px-4 sm:px-6 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,0,127,0.35)] flex items-center gap-2 sm:gap-4">
          <span className="text-pink-400 font-extrabold tracking-widest text-[11px] sm:text-xs uppercase font-syne flex items-center gap-1.5">
            <span className="inline-block animate-spin text-sm">💿</span>
            NAILS BY SOA // 2000s SPECIAL EDITION
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="font-pixel text-pink-300 text-base sm:text-lg tracking-wider hidden sm:inline">
            CORNER HITS: {String(cornerHits).padStart(2, '0')}
          </span>
        </div>

        <div className="text-right font-pixel text-pink-400 text-base sm:text-lg tracking-wider leading-tight">
          <div>DOLBY DIGITAL 5.1 CH</div>
          <div className="text-zinc-400 text-xs sm:text-sm">CH-01: HOT PINK GLAM</div>
        </div>
      </header>

      {/* 2D Bouncing DVD Logo Box (Exact Image from nailsbysoa.netlify.app) */}
      <div
        ref={boxRef}
        id="dvd-logo-box"
        className="absolute top-0 left-0 w-60 h-60 p-2 z-20 transition-colors duration-300 pointer-events-auto group cursor-pointer"
        style={{
          filter: `drop-shadow(0 0 25px ${currentPalette.glow})`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleTriggerEntry();
        }}
        title="Click to enter Nails by Soa Atelier"
      >
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-fuchsia-400 to-cyan-400 opacity-40 blur-md group-hover:opacity-95 group-hover:blur-xl transition duration-300 pointer-events-none" />

        <div
          className="relative w-full h-full rounded-2xl overflow-hidden border-2 bg-black/90 group-hover:border-pink-300 transition duration-300 flex flex-col items-center justify-center p-3"
          style={{
            borderColor: currentPalette.border,
            boxShadow: `0 0 35px ${currentPalette.glow}, inset 0 0 15px ${currentPalette.glow}50`,
          }}
        >
          {/* Exact NBS Nails image from website */}
          <div className="w-full h-full flex items-center justify-center pointer-events-none p-1">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSoyoMWE74YLWm2NmWSG8sTDgMTzgoUd6X6kwpOcdU1X9NSO8_TLWyI1QD3UjvViFGuDecow3ZshIZ_a48miOZOzFGnAvU-hP1BNgFTqUU4nCgOmp2JD6cBdoYFajp7uKWuaZg-ahoD4QhByU-Uk2Q9WUofesRJff3hkodqLd46jowiDzKjM-_AWNEYRJ_sbTUolbaJn7iiSOtyDLBVjAWcqBBkG1Cpv_OcaLc6Q-4GQfPjlKx6gzS"
              alt="Nails by Soa"
              className="w-full h-full object-cover rounded-xl select-none"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/10 to-transparent pointer-events-none" />

          <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
            <span className="inline-block bg-black/85 border border-pink-500/70 px-3 py-0.5 rounded-full text-[10px] font-pixel tracking-widest text-pink-300 uppercase shadow-md backdrop-blur-sm">
              CLICK TO INSERT DISC ✦
            </span>
          </div>
        </div>
      </div>

      {/* Center Interactive Press Start Callout */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 pointer-events-none z-30 px-4">
        <div
          className="pointer-events-auto cursor-pointer group text-center"
          onClick={(e) => {
            e.stopPropagation();
            handleTriggerEntry();
          }}
        >
          <div className="press-start-badge text-2xl sm:text-3xl md:text-4xl text-pink-400 font-bold tracking-wider mb-2 flex items-center justify-center gap-2 sm:gap-3 font-syne">
            <span>▶</span>
            <span>PRESS SCREEN OR CLICK DVD LOGO TO ENTER</span>
            <span>◀</span>
          </div>

          <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-pink-200/80 font-pixel flex items-center justify-center gap-2">
            <span>✧</span>
            CYBER DIVA NAIL ARCHITECTURE & BESPOKE 3D SCULPTING
            <span>✧</span>
          </p>

          <button
            type="button"
            className="mt-4 sm:mt-5 inline-flex items-center gap-2 sm:gap-3 px-7 sm:px-9 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-500 to-pink-500 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(255,0,127,0.75),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-300/70 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>💿 LOAD DISC 01: ENTER SOA VOICE STUDIO NOW</span>
            <span className="text-base sm:text-lg">→</span>
          </button>
        </div>
      </div>

      {/* Disc Loading Modal Overlay during startup transition */}
      {loadingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#18091e] border-2 border-[#ff4a8d] rounded-2xl p-6 shadow-[0_0_50px_rgba(255,74,141,0.8)] text-center text-white flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-pink-500 border-t-transparent animate-spin" />
            <div className="font-pixel text-pink-300 text-lg tracking-widest uppercase">
              {loadingStep}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Status Footer */}
      <footer className="relative z-30 p-4 sm:p-5 flex flex-wrap justify-between items-end border-t border-pink-900/40 bg-black/50 backdrop-blur-sm pointer-events-none gap-2">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="font-pixel text-zinc-300 text-sm tracking-wider">
            SYSTEM: ONLINE // 24-BIT DIGITAL AUDIO // NAILSBYSOA
          </span>
        </div>
        <div className="font-pixel text-pink-400/80 text-xs sm:text-sm">
          ✦ Y2K MCBLING VOICE AI // PRESS ANYWHERE TO LAUNCH ✦
        </div>
      </footer>
    </div>
  );
};
