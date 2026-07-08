import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const GlobalVideoFooter = () => {
  const containerRef = useRef(null);
  const text = "SS JEWELLERY";

  useEffect(() => {
    const letters = containerRef.current.querySelectorAll('.footer-letter');
    const shadowLetters = containerRef.current.querySelectorAll('.footer-shadow-letter');

    // Staggered entrance reveal for the main letters
    gsap.fromTo(letters,
      {
        opacity: 0,
        filter: 'blur(20px)',
        y: 40,
        scale: 0.85
      },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        scale: 1,
        duration: 1.5,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Staggered reveal for the drop shadow glow layer
    gsap.fromTo(shadowLetters,
      {
        opacity: 0,
        filter: 'blur(30px)',
        y: 40,
        scale: 0.85
      },
      {
        opacity: 0.75,
        filter: 'blur(15px)',
        y: 0,
        scale: 1,
        duration: 1.5,
        stagger: 0.08,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );

    // Interactive mouse-hover spring wave animations on letters
    letters.forEach((letter, idx) => {
      // Corresponding shadow letter
      const shadow = shadowLetters[idx];

      const handleMouseEnter = () => {
        gsap.to(letter, {
          y: -18,
          scale: 1.25,
          rotate: 3,
          duration: 0.4,
          ease: 'back.out(2)'
        });
        if (shadow) {
          gsap.to(shadow, {
            y: -10,
            scale: 1.25,
            opacity: 1,
            filter: 'blur(8px)',
            duration: 0.4,
            ease: 'back.out(2)'
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(letter, {
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
        if (shadow) {
          gsap.to(shadow, {
            y: 0,
            scale: 1,
            opacity: 0.75,
            filter: 'blur(15px)',
            duration: 0.6,
            ease: 'power3.out'
          });
        }
      };

      letter.addEventListener('mouseenter', handleMouseEnter);
      letter.addEventListener('mouseleave', handleMouseLeave);

      // Clean up event listeners on unmount
      return () => {
        letter.removeEventListener('mouseenter', handleMouseEnter);
        letter.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <footer 
      ref={containerRef} 
      className="relative w-full bg-[#0F172A] dark:bg-slate-950 border-t border-[#D4A75F]/15 py-12 overflow-hidden flex flex-col items-center justify-center transition-colors duration-300"
    >
      {/* CSS Utility for continuous metallic gold sweep reflection and breathing glow */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gold-shine-sweep {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .gold-metallic-text {
          background: linear-gradient(
            110deg,
            #8A6021 0%,
            #D4A75F 20%,
            #FFF2D4 40%,
            #FFF2D4 60%,
            #D4A75F 80%,
            #8A6021 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          text-transparent: fill;
          animation: gold-shine-sweep 7s linear infinite;
        }
        @keyframes backdrop-breath {
          0% { opacity: 0.65; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.1); }
        }
        .breath-glow-overlay {
          animation: backdrop-breath 5s ease-in-out infinite alternate;
        }
      `}} />

      {/* Ambient glowing backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3F1D5A]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#D4A75F]/4 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative Ornaments */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-[#D4A75F] -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '60s' }} />
      </div>

      {/* Responsive Logo Container with GSAP animated letters */}
      <div className="relative w-full max-w-[95%] mx-auto flex items-center justify-center py-8 select-none pointer-events-none overflow-visible">
        
        {/* Layer 1: Blurred Soft Shadow Layer (Glow Backdrop) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible select-none pointer-events-none">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-black tracking-widest text-center select-none uppercase flex justify-center items-center flex-wrap breath-glow-overlay">
            {text.split('').map((char, index) => (
              <span
                key={`shadow-${index}`}
                className="footer-shadow-letter inline-block text-[#D4A75F] px-1 select-none pointer-events-none"
                style={{ filter: 'blur(15px)' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Layer 2: Sharp Metallic Gold Gradient & Outline (Main Text) */}
        <h2 className="relative z-10 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-black tracking-widest text-center select-none uppercase flex justify-center items-center flex-wrap pointer-events-auto">
          {text.split('').map((char, index) => (
            <span
              key={`letter-${index}`}
              className="footer-letter inline-block gold-metallic-text text-transparent px-1 cursor-default"
              style={{
                WebkitTextStroke: '1.2px rgba(212,167,95,0.3)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

      </div>

      <div className="w-full max-w-[90%] mx-auto flex flex-col items-center justify-center text-center mt-4">
        {/* Subtitle with gold accent */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 0.65, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[9px] sm:text-xs tracking-[0.45em] uppercase text-[#D4A75F] font-bold mb-2"
        >
          Crafting Timeless Elegance
        </motion.p>
      </div>
    </footer>
  );
};
