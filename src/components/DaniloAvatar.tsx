import { useState } from "react";

export interface DaniloAvatarProps {
  className?: string;
}

export default function DaniloAvatar({ className = "w-20 h-20" }: DaniloAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // We check for several potential user filenames as fallbacks
  const [retryCount, setRetryCount] = useState(0);
  const possiblePaths = [
    "/assets/danilo.jpg",
    "/assets/danilo_profile.png",
    "/assets/danilo_profile.jpg",
    "/assets/danilo.png",
    "/danilo_profile.png",
    "/danilo.jpg"
  ];
  const currentPath = possiblePaths[retryCount] || "";

  const handleImageError = () => {
    if (retryCount < possiblePaths.length - 1) {
      setRetryCount(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  if (hasError || !currentPath) {
    // Highly sophisticated and detailed vector schematic of Danilo matching his exact photo
    return (
      <div 
        id="danilo-vector-avatar"
        className={`relative overflow-hidden bg-[#e6dbca] flex items-center justify-center border border-amber-500/20 shadow-inner group-hover:border-amber-400/40 transition-colors ${className}`}
        style={{ borderRadius: "inherit" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full select-none">
          {/* Subtle Ambient Vignette Background */}
          <radialGradient id="beige-grad" cx="50%" cy="50%" r="50%" fx="55%" fy="35%">
            <stop offset="0%" stopColor="#ebe1cf" />
            <stop offset="100%" stopColor="#d3c7b3" />
          </radialGradient>
          <rect width="100" height="100" fill="url(#beige-grad)" />
          
          {/* Shadows behind neck */}
          <path d="M 38,62 C 38,62 50,66 62,62 C 60,56 40,56 38,62 Z" fill="#b9ab96" opacity="0.6" />
          
          {/* Face Profile Neck & Base */}
          <path d="M 44,56 L 44,68 C 44,69 56,69 56,68 L 56,56 Z" fill="#f2d5b6" />
          {/* Neck Shadow */}
          <path d="M 44,56 C 47,60 53,60 56,56 Z" fill="#dbba98" />

          {/* Chin, Ears, and Head Base */}
          <path d="M 33,45 C 31,45 31,48 31.5,50 C 32,52 34,51 34,48 Z" fill="#eecca6" /> {/* Left Ear */}
          <path d="M 67,45 C 69,45 69,48 68.5,50 C 68,52 66,51 66,48 Z" fill="#eecca6" /> {/* Right Ear */}
          
          {/* Main Face Shape */}
          <path d="M 33,40 C 33,56 40,62 50,62 C 60,62 67,56 67,40 C 67,24 61,22 50,22 C 39,22 33,24 33,40 Z" fill="#fbdcb7" />
          
          {/* Cheeks subtle blush for healthy skin layer */}
          <circle cx="38" cy="48" r="4.5" fill="#f87171" opacity="0.1" />
          <circle cx="62" cy="48" r="4.5" fill="#f87171" opacity="0.1" />

          {/* Hair Area (Realistic modern dark crew cut/fringe) */}
          {/* Back/Sides Hair */}
          <path d="M 32,41 C 31,34 33,24 39,19 C 43,15 57,15 61,19 C 67,24 69,34 68,41 C 66,35 63,21 50,21 C 37,21 34,35 32,41 Z" fill="#141211" />
          {/* Bangs fringe layered on forehead */}
          <path d="M 32,32 C 33,25 38,19 46,21 C 48,22 52,22 54,21 C 62,19 67,25 68,32 C 64,28 59,25 55,26 C 53,27 52,29 50,28 C 48,29 47,27 45,26 C 41,25 36,28 32,32 Z" fill="#24211f" />
          <path d="M 31,30 C 33,23 39,18 45,20 C 47,21 53,21 55,20 C 61,18 67,23 69,30 C 66,26 60,23 56,24 C 54,25 52,27 50,25 C 48,27 46,25 44,24 C 40,23 34,26 31,30 Z" fill="#191615" />

          {/* Smooth Eyebrows */}
          <path d="M 37.5,36 C 40,34.5 43,35 45.5,36.2" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M 54.5,36.2 C 57,35 60,34.5 62.5,36" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Eyes (Confidence and clean focus look) */}
          <ellipse cx="42.5" cy="41" rx="2" ry="1.2" fill="#1c1917" />
          <ellipse cx="57.5" cy="41" rx="2" ry="1.2" fill="#1c1917" />
          <circle cx="43.2" cy="40.5" r="0.6" fill="#ffffff" /> {/* Eye light reflex */}
          <circle cx="58.2" cy="40.5" r="0.6" fill="#ffffff" /> {/* Eye light reflex */}

          {/* Nose */}
          <path d="M 49,42 Q 50,51 52,49.5" stroke="#dfb285" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Elegant closed subtle smile */}
          <path d="M 45,54 C 46.5,56 53.5,56 55,54" stroke="#bf8365" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Clear Transparent Designer Glasses */}
          {/* Left Frame */}
          <rect x="36" y="37" width="13" height="9.5" rx="2.5" stroke="#ffffff" strokeWidth="1.1" fill="none" opacity="0.95" />
          <rect x="36.5" y="37.5" width="12" height="8.5" rx="2" stroke="#7dd3fc" strokeWidth="0.6" fill="rgba(125, 211, 252, 0.12)" opacity="0.75" />
          {/* Right Frame */}
          <rect x="51" y="37" width="13" height="9.5" rx="2.5" stroke="#ffffff" strokeWidth="1.1" fill="none" opacity="0.95" />
          <rect x="51.5" y="37.5" width="12" height="8.5" rx="2" stroke="#7dd3fc" strokeWidth="0.6" fill="rgba(125, 211, 252, 0.12)" opacity="0.75" />
          {/* Glasses Bridge connector */}
          <line x1="49" y1="40" x2="51" y2="40" stroke="#ffffff" strokeWidth="1.4" opacity="0.9" />
          {/* Side Temples reaching to ears */}
          <line x1="36" y1="39.5" x2="31.5" y2="39.5" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          <line x1="64" y1="39.5" x2="68.5" y2="39.5" stroke="#ffffff" strokeWidth="1" opacity="0.8" />

          {/* Cream / Beige Crew Neck T-Shirt */}
          <path d="M 28,70 C 28,64 36,61 50,61 C 64,61 72,64 72,70 L 72,88 L 28,88 Z" fill="#eadfcb" />
          {/* Shirt Stitch lines details */}
          <path d="M 39,61.5 C 39,65.5 61,65.5 61,61.5" stroke="#cdc0a6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Subtle clothing folds */}
          <path d="M 31,76 C 35,74 37,79 40,77" stroke="#dacfb8" strokeWidth="1" strokeLinecap="round" fill="none" />
          <path d="M 69,76 C 65,74 63,79 60,77" stroke="#dacfb8" strokeWidth="1" strokeLinecap="round" fill="none" />

          {/* Pocket stitching */}
          <rect x="54" y="69.5" width="7" height="7" rx="1" fill="#dad0ba" opacity="0.4" />
          <line x1="54" y1="69.5" x2="61" y2="69.5" stroke="#c0b399" strokeWidth="0.7" />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-zinc-950 transition-colors ${className}`}
      style={{ borderRadius: "inherit" }}
    >
      <img
        src={currentPath}
        alt="Danilo F. Llaga Jr."
        onError={handleImageError}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
