import { motion } from "motion/react";

export default function LightModeBackgroundShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0 dark:hidden">
      {/* Abstract Grid Grid background that fades in */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.06),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.05),transparent_50%)]" />

      {/* Shape 1: Double Co-axial Rings */}
      <motion.div
        className="absolute top-[12%] right-[10%] w-64 h-64 border border-sky-500/10 rounded-full flex items-center justify-center"
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -35, 20, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-52 h-52 border border-sky-400/5 rounded-full border-dashed" />
        <div className="absolute w-3 h-3 bg-sky-500/15 rounded-full top-6 left-6" />
        <div className="absolute w-2 h-2 bg-teal-400/20 rounded-full bottom-8 right-8" />
      </motion.div>

      {/* Shape 2: Drifting Modern Octagon */}
      <motion.div
        className="absolute top-[45%] left-[8%] w-48 h-48 border border-teal-500/10 rounded-[2rem] flex items-center justify-center"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 25, -35, 0],
          rotate: [0, -120, -240, -360],
          borderRadius: ["2rem", "4rem", "2rem", "2rem"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-36 h-36 border border-teal-400/5 rounded-[1.5rem] border-dashed" />
        <div className="absolute w-2.5 h-2.5 bg-teal-500/15 rounded-full top-1/2 left-4 -translate-y-1/2" />
      </motion.div>

      {/* Shape 3: Geometric Crosshairs / Tech Reticle */}
      <motion.div
        className="absolute top-[75%] right-[12%] w-56 h-56 flex items-center justify-center opacity-70"
        animate={{
          x: [0, -20, 15, 0],
          y: [0, -15, 25, 0],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Simple crisp geometric lines */}
        <div className="absolute w-full h-[1px] bg-sky-500/10" />
        <div className="absolute h-full w-[1px] bg-sky-500/10" />
        <div className="w-24 h-24 border border-dashed border-sky-500/15 rounded-full" />
        <div className="w-12 h-12 border border-sky-500/10 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-rose-450 bg-rose-500/10" />
        </div>
      </motion.div>

      {/* Shape 4: Floating Tech Hexagon Outline or Dotted Card Outline */}
      <motion.div
        className="absolute top-[28%] left-[25%] w-80 h-40 border border-amber-500/8 border-dashed rounded-3xl"
        animate={{
          x: [0, 20, -20, 0],
          y: [0, 30, -15, 0],
          rotate: [0, 15, -15, 0],
          scale: [0.95, 1.02, 0.98, 0.95],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute top-3 left-3 w-2 h-2 bg-amber-500/15 rounded-full" />
        <div className="absolute bottom-3 right-3 w-2 h-2 bg-amber-500/15 rounded-full" />
      </motion.div>

      {/* Shape 5: Floating diagonal geometric guide bars */}
      <motion.div
        className="absolute bottom-[10%] left-[15%] w-32 h-32 flex items-center justify-center"
        animate={{
          x: [0, -15, 25, 0],
          y: [0, 20, -15, 0],
          rotate: [45, 135, 225, 315, 405],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-500/10 to-transparent" />
        <div className="absolute w-1 h-full bg-gradient-to-b from-transparent via-teal-500/10 to-transparent" />
      </motion.div>
    </div>
  );
}
