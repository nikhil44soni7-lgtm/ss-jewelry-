import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const VideoShowcase = () => {
  const sectionRef = useRef(null);
  const videoWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Smooth fade-in and scale reveal on scroll
      gsap.fromTo(
        videoWrapperRef.current,
        { opacity: 0, scale: 0.98 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: videoWrapperRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-transparent py-0"
    >
      {/* Edge-to-Edge Video Player Container with hidden overflow to crop YouTube chrome */}
      <div
        ref={videoWrapperRef}
        className="relative w-full aspect-video bg-black shadow-2xl overflow-hidden pointer-events-none"
      >
        {/* Top and Bottom Gold Borders to Blend with the Luxury Theme */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A75F]/60 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4A75F]/60 to-transparent z-10" />

        {/* 
          Autoplay, loop, muted, no controls.
          To hide the YouTube top bar (title, channel avatar) and bottom watermark/logo,
          we scale the iframe up by 15% and offset it negative absolute positions
          to crop those elements off the edges.
        */}
        <iframe
          className="absolute w-[116%] h-[116%] -left-[8%] -top-[8%] scale-[1.02]"
          src="https://www.youtube.com/embed/ac_eyiZp6mc?autoplay=1&mute=1&loop=1&playlist=ac_eyiZp6mc&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0"
          title="SS Jewellery Video Showcase"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};
