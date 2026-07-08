import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const GlobalVideoFooter = () => {
  return (
    <footer className="relative w-full bg-gradient-to-b from-[#0A0512] via-[#12071E] to-[#08020E] border-t border-[#D4A75F]/15 py-0 overflow-hidden flex flex-col items-center">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-[#D4A75F] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Video Masked text container - Edge-to-edge with zero margins/padding at top/bottom */}
      <div className="w-full p-0 m-0 flex justify-center overflow-hidden">
        <svg className="w-[100vw] h-auto select-none p-0 m-0" viewBox="0 0 1320 380">
          <defs>
            {/* Shimmering gold outline gradient */}
            <linearGradient id="goldOutlineGradient" x1="-100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#D4A75F" />
              <stop offset="50%" stopColor="#FFF2DC" />
              <stop offset="100%" stopColor="#D4A75F" />
              <animate attributeName="x1" values="-100%; 100%" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="x2" values="0%; 200%" dur="3.5s" repeatCount="indefinite" />
            </linearGradient>

            {/* Solid luxury metallic gold gradient fill */}
            <linearGradient id="goldTextGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCE7C8" />
              <stop offset="50%" stopColor="#D4A75F" />
              <stop offset="100%" stopColor="#8A6021" />
            </linearGradient>

            {/* High-quality heavy Gaussian blur filter */}
            <filter id="luxuryBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="15" />
            </filter>

            <style>{`
              .animated-outline {
                stroke-dasharray: 1200;
                stroke-dashoffset: 1200;
                animation: drawTrace 12s linear infinite, glowPulse 4s ease-in-out infinite alternate;
              }
              @keyframes drawTrace {
                0% { stroke-dashoffset: 2400; }
                100% { stroke-dashoffset: 0; }
              }
              @keyframes glowPulse {
                0% { filter: drop-shadow(0 0 2px rgba(212, 167, 95, 0.35)); }
                100% { filter: drop-shadow(0 0 10px rgba(212, 167, 95, 0.75)); }
              }
            `}</style>
          </defs>


          {/* Sharp text layer on top with dynamic fill, outline and draw animation */}
          <motion.text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="url(#goldTextGradient)"
            stroke="url(#goldOutlineGradient)"
            strokeWidth="3.2"
            strokeOpacity="0.95"
            fontSize="300"
            fontWeight="1000"
            fontFamily="'Outfit', 'Inter', sans-serif"
            letterSpacing="0.08em"
            textLength="1300"
            lengthAdjust="spacingAndGlyphs"
            className="pointer-events-none animated-outline"
            initial={{ filter: 'blur(22px)', opacity: 0, scale: 0.94 }}
            whileInView={{ filter: 'blur(0px)', opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            SS JEWELLERY
          </motion.text>
        </svg>
      </div>

      <div className="w-full max-w-[90%] mx-auto flex flex-col items-center justify-center text-center">
        {/* Subtitle with reduced margin */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[9px] sm:text-xs tracking-[0.45em] uppercase text-[#D4A75F] font-bold mb-4 sm:mb-6"
        >
          Crafting Timeless Elegance
        </motion.p>
      </div>
    </footer>
  );
};
