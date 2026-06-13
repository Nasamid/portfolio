import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Smartphone, X, Check, Copy, Sparkles, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HeroQRCode() {
  const [portfolioUrl, setPortfolioUrl] = useState("https://linkedin.com/in/danilo-llaga");
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Direct live app URL
      setPortfolioUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-8 z-30 select-none">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // COLLAPSED COMPACT TRIGGER CARD
          <motion.button
            key="collapsed"
            layoutId="qr-container"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-850 backdrop-blur-md border border-zinc-200 dark:border-gray-800 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] cursor-pointer text-gray-800 dark:text-gray-200 hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[10px] uppercase font-bold tracking-wider transition-all hover:scale-105 active:scale-95"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            title="Scan to View on Mobile"
            id="qr-bubble-trigger"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <QrCode className="w-4 h-4 text-sky-500" />
            <span>Mobile Scan</span>
          </motion.button>
        ) : (
          // EXPANDED INTERACTIVE SCAN CARD
          <motion.div
            key="expanded"
            layoutId="qr-container"
            className="w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-zinc-200 dark:border-gray-850 rounded-2xl p-4 shadow-[0_10px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.5)] text-left relative"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="qr-expanded-card"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-gray-800/80 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5 text-gray-800 dark:text-gray-250">
                <Smartphone className="w-4 h-4 text-sky-500" />
                <span className="font-sans font-bold text-xs uppercase tracking-tight">Mobile Friendly</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                id="qr-close-button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main scan code container */}
            <div className="flex flex-col items-center py-2 bg-zinc-50/50 dark:bg-slate-950/40 rounded-xl border border-zinc-100 dark:border-gray-850 relative overflow-hidden">
              {/* Retro scan targeting frame indicators */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-sky-500/40" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-sky-500/40" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-sky-500/40" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-sky-500/40" />

              <div className="p-3 bg-white rounded-lg shadow-sm">
                <QRCodeSVG
                  value={portfolioUrl}
                  size={144}
                  level="Q"
                  includeMargin={false}
                  imageSettings={{
                    src: "/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>

              <div className="mt-2.5 flex items-center gap-1 text-[9px] font-mono font-bold text-gray-400 dark:text-gray-500 uppercase">
                <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                <span>Align Camera to Scan</span>
              </div>
            </div>

            {/* Quick Actions & URL description */}
            <div className="mt-3.5 space-y-2">
              <div className="text-[10px] text-gray-500 dark:text-gray-400 font-mono break-all leading-relaxed line-clamp-1 border border-dashed border-zinc-200 dark:border-gray-800 px-2.5 py-1.5 rounded-lg bg-zinc-5/5">
                {portfolioUrl}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Copy Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gray-55 dark:bg-slate-800 hover:bg-gray-150 dark:hover:bg-slate-750 text-gray-700 dark:text-gray-200 border border-zinc-200 dark:border-gray-750 rounded-lg text-[10px] font-sans font-semibold transition-all cursor-pointer active:scale-95"
                  id="qr-copy-button"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                {/* Direct External Link */}
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-[10px] font-sans font-semibold transition-all text-center active:scale-95"
                  id="qr-external-link"
                >
                  <span>Open Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
