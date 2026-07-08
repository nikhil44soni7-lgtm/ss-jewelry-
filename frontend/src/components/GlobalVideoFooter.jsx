import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

    // Staggered stagger entrance reveal for the main letters
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

    // Dynamic wave hover & motion animations using GSAP
    const handleEnter = (i) => {
      // Scale, lift, and glow the hovered letter
      gsap.to(letters[i], {
        y: -18,
        scale: 1.25,
        filter: 'drop-shadow(0 0 15px rgba(212, 167, 95, 0.8))',
        duration: 0.3,
        ease: 'power2.out'
      });
      if (shadowLetters[i]) {
        gsap.to(shadowLetters[i], {
          y: -18,
          scale: 1.25,
          opacity: 1,
          filter: 'blur(8px)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      // Elastic lift for left letter
      if (letters[i - 1]) {
        gsap.to(letters[i - 1], {
          y: -6,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      // Elastic lift for right letter
      if (letters[i + 1]) {
        gsap.to(letters[i + 1], {
          y: -6,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleLeave = (i) => {
      // Reset hovered letter back to baseline
      gsap.to(letters[i], {
        y: 0,
        scale: 1,
        filter: 'none',
        duration: 0.45,
        ease: 'power2.out'
      });
      if (shadowLetters[i]) {
        gsap.to(shadowLetters[i], {
          y: 0,
          scale: 1,
          opacity: 0.75,
          filter: 'blur(15px)',
          duration: 0.45,
          ease: 'power2.out'
        });
      }
      // Reset adjacent letters
      if (letters[i - 1]) {
        gsap.to(letters[i - 1], {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out'
        });
      }
      if (letters[i + 1]) {
        gsap.to(letters[i + 1], {
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out'
        });
      }
    };

    const enterHandlers = [];
    const leaveHandlers = [];

    // Bind event listeners
    letters.forEach((letter, i) => {
      const enter = () => handleEnter(i);
      const leave = () => handleLeave(i);
      
      letter.addEventListener('mouseenter', enter);
      letter.addEventListener('mouseleave', leave);
      
      enterHandlers.push(enter);
      leaveHandlers.push(leave);
    });

    // Cleanup listeners on component unmount
    return () => {
      letters.forEach((letter, i) => {
        letter.removeEventListener('mouseenter', enterHandlers[i]);
        letter.removeEventListener('mouseleave', leaveHandlers[i]);
      });
    };
  }, []);

  return (
    <footer 
      ref={containerRef} 
      className="relative w-full bg-[#0F172A] dark:bg-slate-950 border-t border-[#D4A75F]/15 py-12 overflow-hidden flex flex-col items-center justify-center transition-colors duration-300"
    >
      {/* Ambient glowing backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3F1D5A]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#D4A75F]/4 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative Ornaments */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full border border-[#D4A75F] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Responsive Logo Container with GSAP animated letters */}
      <div className="relative w-full max-w-[95%] mx-auto flex items-center justify-center py-8 select-none pointer-events-none overflow-visible">
        
        {/* Layer 1: Blurred Soft Shadow Layer (Glow) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-visible select-none pointer-events-none">
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-black tracking-widest text-center select-none uppercase flex justify-center items-center flex-wrap">
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

        {/* Layer 2: Sharp Metallic Gold Gradient & Outline */}
        <h2 className="relative z-10 text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-black tracking-widest text-center select-none uppercase flex justify-center items-center flex-wrap pointer-events-auto">
          {text.split('').map((char, index) => (
            <span
              key={`letter-${index}`}
              className="footer-letter inline-block bg-gradient-to-b from-[#FFF2D4] via-[#D4A75F] to-[#8C601E] bg-clip-text text-transparent px-1 cursor-pointer"
              style={{
                WebkitTextStroke: '1.2px rgba(212,167,95,0.3)',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>

      </div>

      <div className="w-full max-w-[90%] mx-auto flex flex-col items-center justify-center text-center mt-4 pointer-events-none">
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
