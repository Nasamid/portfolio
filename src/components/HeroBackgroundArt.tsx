import { motion } from "motion/react";

export default function HeroBackgroundArt() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 dark:hidden">
      {/* 1. Technical Blueprint Canvas Base */}
      <div className="absolute inset-0 bg-[#f8fafc]/95" />

      {/* 2. Sleek Dotted Grid Pattern specifically matching the dark mode layout but in light mode */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(#cbd5e0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-100"
      />

      {/* 3. Concentric Optical Lens Calibration Circles (Sleek light cyan / slate blueprint) */}
      <motion.div
        className="absolute right-[-10%] top-[8%] w-[600px] h-[600px] border border-sky-400/10 rounded-full flex items-center justify-center"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-[500px] h-[500px] border border-dashed border-sky-500/15 rounded-full" />
        <div className="absolute w-[360px] h-[360px] border border-emerald-500/10 rounded-full flex items-center justify-center">
          <div className="w-[220px] h-[220px] border border-dashed border-sky-400/20 rounded-full" />
        </div>
      </motion.div>

      {/* 4. Schematic Bounding Box Target (matches AOI inspection style) */}
      <motion.div
        className="absolute left-[8%] top-[12%] w-[240px] h-[160px] border border-sky-500/10 bg-sky-50/5 rounded-xl p-4 flex flex-col justify-between"
        animate={{
          y: [0, -10, 10, 0],
          x: [0, 8, -8, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Reticles on the bounding corners */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-sky-500/30"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-sky-500/30"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-sky-500/30"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-sky-500/30"></div>

        {/* Minimal chart skeleton */}
        <div className="space-y-1.5 mt-auto">
          <div className="w-full h-[2.5px] bg-sky-100 rounded" />
          <div className="w-[85%] h-[2.5px] bg-sky-100 rounded" />
          <div className="w-[60%] h-[2.5px] bg-emerald-500/20 rounded animate-pulse" />
        </div>
      </motion.div>

      {/* 5. Flow Diagram / Hardware Path Track */}
      <div className="absolute top-[50%] left-[12%] w-[280px] h-[300px] opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-slate-300">
          {/* Vector flow diagram lines */}
          <path 
            d="M 10 10 H 70 V 60 H 90" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            strokeDasharray="1.5 1.5" 
          />
          <path 
            d="M 10 10 H 30 V 80 H 90" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
          />
          <circle cx="10" cy="10" r="1.5" className="fill-sky-500/60" />
          <circle cx="70" cy="10" r="1.5" className="fill-emerald-500/60" />
          <circle cx="90" cy="60" r="1.5" className="fill-rose-400/60" />
          <circle cx="30" cy="80" r="1.5" className="fill-sky-500/60" />
        </svg>
      </div>

      {/* 6. Floating Laser Scanned Reticle Ring */}
      <motion.div
        className="absolute bottom-[10%] right-[15%] w-72 h-72 border border-sky-500/5 rounded-full flex items-center justify-center p-4"
        animate={{
          scale: [0.95, 1.05, 0.95],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full border border-dashed border-[#fa8072]/15 rounded-full flex items-center justify-center">
          <div className="w-32 h-32 border border-emerald-500/5 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-sky-500/10 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* 8. Modern Digital Scanning Line Wave Overlay */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-500/10 to-transparent"
        animate={{
          top: ["0%", "100%", "0%"]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
