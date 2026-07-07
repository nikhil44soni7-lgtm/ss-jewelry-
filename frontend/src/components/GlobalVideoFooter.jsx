import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const GlobalVideoFooter = () => {
  return (
    <footer className="relative w-full bg-[#07030C] border-t border-[#D4A75F]/15 py-12 sm:py-16 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-[#D4A75F] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-[90%] mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Video Masked text container */}
        <div className="w-full max-w-5xl mx-auto mb-4 sm:mb-6 relative">
          <svg className="w-full h-auto select-none" viewBox="0 0 1000 160">
            <defs>
              <mask id="text-mask" x="0" y="0" width="100%" height="100%">
                <rect x="0" y="0" width="100%" height="100%" fill="black" />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="82"
                  fontWeight="950"
                  fontFamily="'Outfit', 'Inter', sans-serif"
                  letterSpacing="0.14em"
                >
                  SS JEWELLERY
                </text>
              </mask>
            </defs>
            
            <foreignObject x="0" y="0" width="100%" height="100%" mask="url(#text-mask)">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="/jewelry-showcase.mp4"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
            </foreignObject>
          </svg>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[9px] sm:text-xs tracking-[0.45em] uppercase text-[#D4A75F] font-bold mb-8 sm:mb-12"
        >
          Crafting Timeless Elegance
        </motion.p>

        {/* Quick Copyright */}
        <div className="w-full border-t border-slate-900/60 dark:border-slate-900/60 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SS JEWELLERY. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="/support" className="hover:text-[#D4A75F] transition-colors">Support</Link>
            <Link to="/support-center" className="hover:text-[#D4A75F] transition-colors">Privacy Policy</Link>
            <Link to="/cart" className="hover:text-[#D4A75F] transition-colors">My Cart</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
