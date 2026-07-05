import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Star, Sparkles, X, Search, Users, Calendar, Clock, DollarSign, MapPin, Check, Lock, RefreshCw, Plus, Trash2, Edit3, Upload } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { ProductCard, ProductCardSkeleton } from '../components/ProductCard';
import { ProductDetails } from './ProductDetails';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import { LuxuryImage } from '../components/LuxuryImage';


const ACTION_TYPES = [
  "Product Added",
  "Product Updated",
  "Product Deleted",
  "Stock Updated",
  "Price Changed",
  "Category Changed",
  "User Blocked",
  "User Unblocked",
  "Order Updated",
  "Order Cancelled",
  "Support Ticket Updated",
  "Admin Login",
  "Admin Logout"
];

const BannerSkeleton = () => (
  <div className="relative h-[480px] lg:h-[680px] xl:h-[740px] min-h-[450px] overflow-hidden rounded-[16px] lg:rounded-[20px] bg-[#1B0B26] border border-[#D4A75F]/15 flex items-center justify-center">
    <div className="absolute inset-0 luxury-gold-shimmer pointer-events-none" />
    <img
      src="/logo.svg"
      alt="SSJewellery"
      className="h-24 w-auto opacity-60 object-contain relative z-20 animate-pulse"
    />
  </div>
);

const MobileBannerSkeleton = () => (
  <div className="relative h-[390px] xs:h-[420px] sm:h-[440px] overflow-hidden rounded-[16px] bg-[#1B0B26] border border-[#D4A75F]/15 flex items-center justify-center">
    <div className="absolute inset-0 luxury-gold-shimmer pointer-events-none" />
    <img
      src="/logo.svg"
      alt="SSJewellery"
      className="h-16 w-auto opacity-60 object-contain relative z-20 animate-pulse"
    />
  </div>
);

const CategorySkeleton = () => (
  <div className="hidden md:block w-full bg-white dark:bg-[#0B1020] border-y border-[#F2E8D9] dark:border-slate-800/80 py-10 lg:py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="skeleton-premium h-8 w-48 rounded-lg animate-pulse" />
        <div className="skeleton-premium h-3 w-64 rounded mt-3 animate-pulse" />
      </div>
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
        {[
          { label: "Rings" },
          { label: "Necklaces" },
          { label: "Earrings" },
          { label: "Bracelets" },
          { label: "Bridal Collection" }
        ].map((cat, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center w-24 sm:w-28">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#F2E8D9]/60 dark:border-slate-800/80 p-1 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 luxury-gold-shimmer pointer-events-none" />
              <img
                src="/logo.svg"
                alt="Loading..."
                className="w-8 h-auto opacity-40 object-contain relative z-20 animate-pulse"
              />
            </div>
            <div className="skeleton-premium h-3.5 w-16 rounded mt-3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MobileCategorySkeleton = () => (
  <div className="block md:hidden w-full bg-white dark:bg-[#0B1020] border-y border-[#F2E8D9] dark:border-slate-800/80 py-4">
    <div className="w-[94vw] mx-auto px-1">
      <div className="text-center mb-4 flex flex-col items-center">
        <div className="skeleton-premium h-6 w-36 rounded animate-pulse" />
      </div>
      <div className="flex overflow-x-auto gap-3.5 pb-2">
        {[
          { label: "Rings" },
          { label: "Necklaces" },
          { label: "Earrings" },
          { label: "Bracelets" },
          { label: "Bridal Collection" }
        ].map((cat, idx) => (
          <div key={idx} className="flex-none flex flex-col items-center justify-center w-[76px]">
            <div className="w-[68px] h-[68px] rounded-full border-2 border-[#F2E8D9]/60 dark:border-slate-800/80 p-1 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 luxury-gold-shimmer pointer-events-none" />
              <img
                src="/logo.svg"
                alt="Loading..."
                className="w-7 h-auto opacity-40 object-contain relative z-20 animate-pulse"
              />
            </div>
            <div className="skeleton-premium h-3 w-12 rounded mt-2.5 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BannerSlider = React.memo(({ 
  slides, 
  activeSlide, 
  setActiveSlide, 
  isAdmin, 
  handleNextSlide, 
  handlePrevSlide, 
  bannersLoading,
  onCategoryClick
}) => {
  const slideRefs        = useRef([]);
  const contentRef       = useRef(null);
  const badgeRef         = useRef(null);
  const titleRef         = useRef(null);
  const subtitleRef      = useRef(null);
  const descRef          = useRef(null);
  const btnRef           = useRef(null);
  const progressBarRef   = useRef(null);
  const prevActiveRef    = useRef(activeSlide);
  const isAnimatingRef   = useRef(false);

  const handleBannerButtonClick = useCallback((e, slide) => {
    const link = slide.btnLink || `/?category=${slide.catFilter}`;
    if (link.startsWith('/?category=') || link === '/') {
      e.preventDefault();
      onCategoryClick(slide.catFilter || 'All', 'banner');
    }
  }, [onCategoryClick]);

  /* ---------- Text stagger-in timeline ---------- */
  const runTextIn = useCallback(() => {
    const els = [
      badgeRef.current,
      titleRef.current,
      subtitleRef.current,
      descRef.current,
      btnRef.current
    ].filter(Boolean);
    if (els.length === 0) return;
    gsap.killTweensOf(els);
    const tl = gsap.timeline();
    tl.set(els, { opacity: 0, y: 32 });
    if (badgeRef.current)
      tl.to(badgeRef.current,    { opacity: 1, y: 0, duration: 0.48, ease: 'back.out(2)' });
    if (titleRef.current)
      tl.to(titleRef.current,    { opacity: 1, y: 0, duration: 0.62, ease: 'power3.out' }, '-=0.22');
    if (subtitleRef.current)
      tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.52, ease: 'power2.out' }, '-=0.35');
    if (descRef.current)
      tl.to(descRef.current,     { opacity: 1, y: 0, duration: 0.48, ease: 'power2.out' }, '-=0.28');
    if (btnRef.current)
      tl.to(btnRef.current,      { opacity: 1, y: 0, duration: 0.48, ease: 'back.out(1.6)' }, '-=0.22');
  }, []);

  /* ---------- Progress bar animation ---------- */
  const runProgressBar = useCallback(() => {
    if (!progressBarRef.current) return;
    gsap.killTweensOf(progressBarRef.current);
    gsap.fromTo(
      progressBarRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 5, ease: 'none', transformOrigin: 'left center' }
    );
  }, []);

  /* ---------- Initial mount animation ---------- */
  useEffect(() => {
    if (bannersLoading || slides.length === 0) return;
    const timer = setTimeout(() => {
      runTextIn();
      runProgressBar();
    }, 200);
    return () => clearTimeout(timer);
  }, [bannersLoading, slides.length, runTextIn, runProgressBar]);

  /* ---------- GSAP 3D slide transition ---------- */
  useEffect(() => {
    if (bannersLoading || slides.length === 0) return;
    const prev = prevActiveRef.current;
    const curr = activeSlide;
    if (prev === curr) return;
    if (isAnimatingRef.current) {
      prevActiveRef.current = curr;
      return;
    }
    isAnimatingRef.current = true;

    /* Animate current text OUT */
    const textEls = [
      badgeRef.current, titleRef.current,
      subtitleRef.current, descRef.current, btnRef.current
    ].filter(Boolean);
    if (textEls.length > 0) {
      gsap.to(textEls, { opacity: 0, y: -22, duration: 0.28, ease: 'power2.in', stagger: 0.05 });
    }

    const dir = (curr > prev || (prev === slides.length - 1 && curr === 0)) ? 1 : -1;
    const prevEl = slideRefs.current[prev];
    const currEl = slideRefs.current[curr];

    /* OUT: previous slide rotates away */
    if (prevEl) {
      gsap.to(prevEl, {
        opacity: 0,
        rotationY: dir * -22,
        scale: 0.84,
        z: -280,
        duration: 0.72,
        ease: 'power3.inOut',
        onComplete: () => {
          gsap.set(prevEl, { rotationY: 0, scale: 1, z: 0, zIndex: 1 });
        }
      });
    }

    /* IN: incoming slide arrives from depth */
    if (currEl) {
      gsap.set(currEl, {
        opacity: 0,
        rotationY: dir * 26,
        scale: 0.88,
        z: -220,
        zIndex: 10
      });
      gsap.to(currEl, {
        opacity: 1,
        rotationY: 0,
        scale: 1,
        z: 0,
        duration: 0.78,
        ease: 'power3.out',
        delay: 0.12,
        onComplete: () => {
          isAnimatingRef.current = false;
          prevActiveRef.current = curr;
          runTextIn();
          runProgressBar();
        }
      });
    }
  }, [activeSlide, bannersLoading, slides.length, runTextIn, runProgressBar]);

  if (bannersLoading) {
    return (
      <>
        {/* Desktop Loading Skeleton */}
        <div className="hidden md:block relative w-full">
          <div className="relative overflow-hidden bg-[#1B0B26] flex items-center justify-center h-screen min-h-[600px]">
            <div className="absolute inset-0 luxury-gold-shimmer pointer-events-none" />
            <img src="/logo.svg" alt="SSJewellery" className="h-20 w-auto opacity-60 object-contain relative z-20 animate-pulse" />
          </div>
        </div>
        {/* Mobile Loading Skeleton */}
        <div className="block md:hidden w-[94vw] mx-auto mt-[24px] mb-8">
          <MobileBannerSkeleton />
        </div>
      </>
    );
  }

  const currentSlide = slides[activeSlide] || slides[0];
  if (!currentSlide) return null;

  return (
    <>
      {/* Desktop view */}
      <div
        className="hidden md:block relative w-full mb-10 lg:mb-12 hero-slider-container"
        style={{ perspective: '1400px' }}
      >
        {/* ======== SLIDER CONTAINER ======== */}
        <div
          className="relative overflow-hidden"
          style={{
            height: '100vh',
            minHeight: '600px',
            maxHeight: '1000px',
            boxShadow: '0 0 80px rgba(212,167,95,0.12) inset',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* ---- BACKGROUND SLIDES ---- */}
          {slides.map((slide, idx) => (
            <div
              key={idx}
              ref={el => { slideRefs.current[idx] = el; }}
              style={{
                position: 'absolute', inset: 0,
                opacity: idx === activeSlide ? 1 : 0,
                zIndex: idx === activeSlide ? 10 : 1,
                transformStyle: 'preserve-3d',
                willChange: 'transform, opacity'
              }}
            >
              {/* Full-bleed image — brightness boosted for vivid, glowing look */}
              {slide.image_url ? (
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="hero-image-glow"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center',
                    userSelect: 'none'
                  }}
                  draggable={false}
                />
              ) : (
                <div
                  style={{ position: 'absolute', inset: 0 }}
                  className={`bg-gradient-to-br ${slide.gradient || 'from-[#1B0B26] via-[#3F1D5A] to-[#2E1442]'}`}
                />
              )}

              {/* Lightweight gradient — left side only for text, right side stays clear */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.42) 38%, rgba(0,0,0,0.10) 62%, rgba(0,0,0,0.04) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 35%, rgba(0,0,0,0.08) 100%)' }} />
              {/* Vibrant gold radial glow on left — makes image pop */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 5% 70%, rgba(212,167,95,0.20), transparent 60%)' }} />
              {/* Warm amber inner glow at image center */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 65% 50%, rgba(255,200,100,0.06), transparent 55%)' }} />
              {/* Bottom fade to blend into page */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '140px', background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)' }} />
              {/* Gold top rule */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(to right, transparent, rgba(212,167,95,0.80), transparent)' }} />
            </div>
          ))}

          {/* ---- FLOATING GOLD PARTICLES ---- */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', overflow: 'hidden' }}>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="animate-float-slow"
                style={{
                  position: 'absolute',
                  borderRadius: '50%',
                  background: `rgba(212,167,95,${0.08 + i * 0.025})`,
                  width: `${5 + i * 3}px`,
                  height: `${5 + i * 3}px`,
                  left: `${8 + i * 9}%`,
                  top: `${15 + (i % 5) * 17}%`,
                  animationDuration: `${4.5 + i * 0.7}s`,
                  animationDelay: `${i * 0.35}s`,
                  filter: 'blur(1.5px)'
                }}
              />
            ))}
          </div>

          {/* ---- DECORATIVE CORNER ORNAMENT ---- */}
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 25, pointerEvents: 'none' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" opacity="0.45">
              <path d="M2 2 L24 2" stroke="#D4A75F" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 2 L2 24" stroke="#D4A75F" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="2" cy="2" r="2.5" fill="#D4A75F"/>
            </svg>
          </div>

          {/* ---- SLIDE COUNTER — top right ---- */}
          <div
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 40,
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              background: 'rgba(0,0,0,0.30)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,167,95,0.22)',
              borderRadius: '999px'
            }}
          >
            <span style={{ color: '#D4A75F', fontFamily: 'serif', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1 }}>
              {String(activeSlide + 1).padStart(2, '0')}
            </span>
            <div style={{ width: '20px', height: '1px', background: 'rgba(212,167,95,0.40)' }} />
            <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: '0.75rem', fontWeight: 500 }}>
              {String(slides.length).padStart(2, '0')}
            </span>
          </div>

          {/* ---- CONTENT OVERLAY ---- */}
          <div
            ref={contentRef}
            style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center' }}
          >
            <div className="w-full max-w-2xl xl:max-w-3xl px-8 sm:px-12 md:px-14 lg:px-20">
              {/* Badge */}
              <div ref={badgeRef} style={{ opacity: 0 }} className="mb-4 sm:mb-5">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#D4A75F]/15 text-[#D4A75F] border border-[#D4A75F]/35 backdrop-blur-sm tracking-[0.15em] uppercase shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  {currentSlide.badge}
                </span>
              </div>

              {/* Main Title */}
              <h1
                ref={titleRef}
                className="font-serif font-bold text-white leading-[1.07] tracking-tight mb-3 sm:mb-4"
                style={{ opacity: 0, fontSize: 'clamp(1.85rem, 4.8vw, 4.5rem)', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                {currentSlide.title}
              </h1>

              {/* Gold Subtitle */}
              <p
                ref={subtitleRef}
                className="font-serif text-[#D4A75F] mb-3"
                style={{ opacity: 0, fontSize: 'clamp(1rem, 2vw, 1.45rem)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
              >
                {currentSlide.subtitle}
              </p>

              {/* Description */}
              <p
                ref={descRef}
                className="text-slate-300/85 leading-relaxed mb-7 sm:mb-8 max-w-lg hidden sm:block text-sm"
                style={{ opacity: 0 }}
              >
                {currentSlide.desc}
              </p>

              {/* CTA Row */}
              <div ref={btnRef} className="flex items-center gap-4" style={{ opacity: 0 }}>
                <Link
                  to={currentSlide.btnLink || `/?category=${currentSlide.catFilter}`}
                  onClick={(e) => handleBannerButtonClick(e, currentSlide)}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#D4A75F] hover:bg-[#BF934B] text-white font-bold text-sm uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-105 gold-shimmer-btn relative overflow-hidden"
                  style={{ boxShadow: '0 8px 36px rgba(212,167,95,0.50), 0 2px 8px rgba(0,0,0,0.3)' }}
                >
                  {currentSlide.btnText}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <div className="hidden sm:block w-px h-10 bg-white/20" />
                <Link
                  to="/?category=All"
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryClick('All', 'banner');
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 text-white/55 hover:text-[#D4A75F] text-xs font-semibold uppercase tracking-widest transition-colors duration-200"
                >
                  View All
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* ---- ADMIN EDIT BUTTON ---- */}
          {isAdmin && (
            <Link
              to="/admin-control?tab=config"
              className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold backdrop-blur-md transition-all hover:scale-105 cursor-pointer animate-pulse"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Banners</span>
            </Link>
          )}

          {/* ---- PAGINATION DOT INDICATORS ---- */}
          <div
            className="absolute z-40 flex items-center gap-2.5"
            style={{ bottom: '28px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="cursor-pointer rounded-full"
                style={{
                  width: idx === activeSlide ? '28px' : '8px',
                  height: '8px',
                  background: idx === activeSlide ? '#D4A75F' : 'rgba(255,255,255,0.30)',
                  boxShadow: idx === activeSlide ? '0 0 12px rgba(212,167,95,0.80), 0 0 4px rgba(212,167,95,0.50)' : 'none',
                  border: 'none', padding: 0,
                  transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)'
                }}
              />
            ))}
          </div>

          {/* ---- ANIMATED GOLD BOTTOM STRIP ---- */}
          <div
            className="hero-gold-bottom"
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 45, height: '3px', pointerEvents: 'none' }}
          />

          {/* ---- PROGRESS STRIPS (bottom) ---- */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', height: '3px' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                style={{
                  flex: 1,
                  background: idx === activeSlide ? 'transparent' : 'rgba(255,255,255,0.18)',
                  position: 'relative',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                  overflow: 'hidden',
                  transition: 'background 0.3s'
                }}
              >
                {idx === activeSlide && (
                  <div
                    ref={progressBarRef}
                    style={{
                      position: 'absolute', inset: 0,
                      background: '#D4A75F',
                      transformOrigin: 'left center',
                      transform: 'scaleX(0)'
                    }}
                  />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile view */}
      <div className="block md:hidden w-[94vw] mx-auto mt-[24px] mb-8">
        <div className="relative h-[390px] xs:h-[420px] sm:h-[440px] overflow-hidden rounded-[16px] shadow-[0_20px_50px_rgba(27,11,38,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#D4A75F]/15 dark:border-white/5 bg-gradient-to-tr from-[#1B0B26] via-[#3F1D5A] to-[#2E1442]">
          {isAdmin && (
            <Link
              to="/admin-control?tab=config"
              className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold backdrop-blur-md transition-all duration-300 hover:scale-105 shadow-sm cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              <span>Edit Banner</span>
            </Link>
          )}

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(event, info) => {
              const swipeThreshold = 40;
              if (info.offset.x < -swipeThreshold) {
                handleNextSlide();
              } else if (info.offset.x > swipeThreshold) {
                handlePrevSlide();
              }
            }}
            className="w-full h-full cursor-grab active:cursor-grabbing relative"
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 bg-gradient-to-tr ${slide.gradient || 'from-[#1B0B26] via-[#3F1D5A] to-[#2E1442]'} transition-opacity duration-1000 ${
                  idx === activeSlide
                    ? 'opacity-100 z-10'
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-[#1B0B26]/30 to-[#3F1D5A]/10 mix-blend-multiply opacity-90 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,167,95,0.15),transparent_50%)] pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4A75F]/20 to-transparent pointer-events-none" />

                <div className="h-full flex flex-col items-center justify-between text-center pt-5 pb-8 px-4 text-white z-10 relative">

                  <div className="flex flex-col items-center">
                    <motion.h1
                      initial={{ opacity: 0, y: 15 }}
                      animate={idx === activeSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-[28px] xs:text-[32px] sm:text-[36px] font-serif font-bold tracking-normal leading-[1.2] text-white mb-1.5 max-w-[280px] xs:max-w-md break-words animate-in fade-in"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={idx === activeSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-[14px] xs:text-[15px] sm:text-[16px] font-serif text-[#D4A75F] max-w-[280px] xs:max-w-md break-words"
                    >
                      {slide.subtitle}
                    </motion.p>
                  </div>

                  <div className="my-2">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={idx === activeSlide ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                      className="w-fit"
                    >
                      <Link
                        to={slide.btnLink || `/?category=${slide.catFilter}`}
                        onClick={(e) => handleBannerButtonClick(e, slide)}
                        className="px-5 py-2 bg-[#D4A75F] text-white font-bold text-[11px] uppercase tracking-wider rounded-full shadow-lg transition-transform active:scale-95 duration-300 w-fit flex items-center gap-1.5 cursor-pointer gold-shimmer-btn relative overflow-hidden"
                      >
                        {slide.btnText}
                      </Link>
                    </motion.div>
                  </div>

                  {slide.image_url && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={idx === activeSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                      transition={{ duration: 0.6, delay: 0.45 }}
                      className="w-full h-[140px] xs:h-[160px] sm:h-[180px] flex items-center justify-center relative mt-2"
                    >
                      <LuxuryImage
                        src={slide.image_url}
                        alt={slide.title}
                        draggable="false"
                        className="h-full w-auto object-contain rounded-xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] select-none"
                        width="300"
                        height="200"
                      />
                    </motion.div>
                  )}

                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeSlide ? 'bg-[#D4A75F] w-6' : 'bg-slate-350 dark:bg-slate-800 hover:bg-slate-200 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
});

const CategoryGrid = React.memo(({ activeCategory, loading, onCategoryClick }) => {
  if (loading) {
    return (
      <>
        <CategorySkeleton />
        <MobileCategorySkeleton />
      </>
    );
  }

  const categories = [
    { name: "Rings", label: "Rings", img: "/cat_rings.png" },
    { name: "Necklaces", label: "Necklaces", img: "/cat_necklaces.png" },
    { name: "Earrings", label: "Earrings", img: "/cat_earrings.png" },
    { name: "Bracelets", label: "Bracelets", img: "/cat_bracelets.png" },
    { name: "Bridal Collection", label: "Bridal Collection", img: "/cat_bridal.png" }
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block w-full bg-white dark:bg-[#0B1020] border-y border-[#F2E8D9] dark:border-slate-800/80 py-12 lg:py-16 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <span className="text-xs md:text-sm font-bold tracking-[0.3em] text-[#D4A75F] uppercase block mb-2">CURATED COLLECTIONS</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3F1D5A] dark:text-[#D4A75F] tracking-wide relative inline-block pb-3 transition-colors duration-300">
              Category
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-[#D4A75F]"></span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-[#CBD5E1] mt-3 md:mt-4 tracking-[0.18em] uppercase font-semibold transition-colors duration-300">
              Discover our exquisite handcrafted masterpieces
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 category-grid-container">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.div
                  key={cat.name}
                  animate={isActive ? { scale: 1.03, y: -6 } : { scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative group category-card-item rounded-[24px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                    isActive ? 'category-card-item-active' : ''
                  }`}
                >
                  <Link
                    to={`/?category=${encodeURIComponent(cat.name)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(cat.name);
                    }}
                    className="block w-full h-full relative"
                  >
                    {/* Category Image */}
                    <div className="w-full h-80 overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <LuxuryImage
                        src={cat.img}
                        alt={cat.label}
                        width="300"
                        height="400"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 luxury-category-img"
                      />
                    </div>

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

                    {/* Floating Glassmorphic Label */}
                    <div className={`absolute bottom-4 left-4 right-4 backdrop-blur-md rounded-2xl p-3.5 border transition-all duration-500 text-center ${
                      isActive
                        ? 'bg-[#D4A75F] border-[#D4A75F] text-white shadow-[0_8px_20px_rgba(212,167,95,0.4)]'
                        : 'bg-black/40 border-white/10 text-white group-hover:bg-[#D4A75F] group-hover:border-[#D4A75F] group-hover:shadow-[0_8px_20px_rgba(212,167,95,0.4)]'
                    }`}>
                      <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.18em] uppercase block">
                        {cat.label}
                      </span>
                      <div className={`w-1 h-1 rounded-full bg-white mx-auto mt-1 transition-all duration-300 ${
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100'
                      }`} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="block md:hidden w-full bg-white dark:bg-[#0B1020] border-y border-[#F2E8D9] dark:border-slate-800/80 py-8 transition-colors duration-300"
      >
        <div className="w-[94vw] mx-auto px-1">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3F1D5A] dark:text-[#D4A75F] tracking-wide relative inline-block pb-2 transition-colors duration-300">
              Category
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#D4A75F]"></span>
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 scroll-smooth snap-x snap-mandatory justify-start no-scrollbar">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.div
                  key={cat.name}
                  animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`flex-none w-44 snap-center rounded-[20px] overflow-hidden shadow-md category-card-item ${
                    isActive ? 'category-card-item-active' : ''
                  }`}
                >
                  <Link
                    to={`/?category=${encodeURIComponent(cat.name)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onCategoryClick(cat.name);
                    }}
                    className="block w-full h-full relative"
                  >
                    {/* Category Image */}
                    <div className="w-full h-60 overflow-hidden bg-slate-50 dark:bg-slate-900">
                      <LuxuryImage
                        src={cat.img}
                        alt={cat.label}
                        width="180"
                        height="240"
                        className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-108 luxury-category-img"
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent pointer-events-none" />

                    {/* Label */}
                    <div className={`absolute bottom-3 left-3 right-3 backdrop-blur-sm rounded-xl p-2.5 border transition-all duration-300 text-center ${
                      isActive
                        ? 'bg-[#D4A75F] border-[#D4A75F] text-white shadow-md'
                        : 'bg-black/35 border-white/10 text-white'
                    }`}>
                      <span className="text-xs font-bold tracking-[0.15em] uppercase block">
                        {cat.label}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
});

const ProductGridArea = React.memo(({ 
  products, 
  loading, 
  error, 
  isAdmin, 
  setSelectedAdminProductId,
  activeTab
}) => {
  if (activeTab !== 'products') return null;

  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center max-w-xl mx-auto my-12">
        <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">Failed to Load Products</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold mt-4">No Products Found</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          We couldn't find any products matching your current category filter or search query.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-5 py-2 bg-[#3F1D5A] hover:bg-[#2E1442] text-white rounded-xl text-xs font-bold shadow-md"
        >
          View All Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onAdminAction={setSelectedAdminProductId}
        />
      ))}
    </div>
  );
});

export const Home = () => {
  const { language, isAdmin } = useContext(AuthContext);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  const activeSearch = searchParams.get('search') || '';

  // Parallax scroll effects for Hero Banner
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 80]);
  const opacityParallax = useTransform(scrollY, [0, 400], [1, 0]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAdminProductId, setSelectedAdminProductId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState('products');
  const [usersComplete, setUsersComplete] = useState([]);
  const [usersAnalytics, setUsersAnalytics] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [userPage, setUserPage] = useState(1);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState(null);
  const itemsPerPage = 10;

  const [usersRefreshTrigger, setUsersRefreshTrigger] = useState(0);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirm_password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    role: 'customer'
  });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [addUserSuccess, setAddUserSuccess] = useState(null);

  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setAddUserError(null);
    setAddUserSuccess(null);

    if (addUserForm.password !== addUserForm.confirm_password) {
      setAddUserError("Passwords do not match.");
      return;
    }

    setAddUserLoading(true);
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/admin/users`,
        {
          name: addUserForm.name,
          email: addUserForm.email,
          password: addUserForm.password,
          confirm_password: addUserForm.confirm_password,
          mobile: addUserForm.mobile,
          role: addUserForm.role,
          address: addUserForm.address,
          city: addUserForm.city,
          state: addUserForm.state,
          pincode: addUserForm.pincode
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setAddUserSuccess("User created successfully");
        setAddUserForm({
          name: '',
          mobile: '',
          email: '',
          password: '',
          confirm_password: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          role: 'customer'
        });

        setUsersRefreshTrigger(prev => prev + 1);

        setTimeout(() => {
          setAddUserSuccess(null);
          setShowAddUserModal(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setAddUserError(err.response?.data?.message || "Failed to create user. Please try again.");
    } finally {
      setAddUserLoading(false);
    }
  };

  const [generalAuditLogs, setGeneralAuditLogs] = useState([]);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionType, setAuditActionType] = useState('');
  const [auditStatus, setAuditStatus] = useState('');
  const [auditPage, setAuditPage] = useState(1);
  const auditPerPage = 10;

  const fetchGeneralAuditLogs = async () => {
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      const params = {};
      if (auditSearch.trim()) params.search = auditSearch;
      if (auditActionType) params.action_type = auditActionType;
      if (auditStatus) params.status = auditStatus;

      const res = await axios.get(`${API_BASE_URL}/admin/general-audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: params
      });
      setGeneralAuditLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch general audit logs:", err);
    }
  };



  useEffect(() => {
    if (isAdmin && activeTab === 'analytics') {
      fetchGeneralAuditLogs();
    }
  }, [isAdmin, activeTab, auditSearch, auditActionType, auditStatus]);

  useEffect(() => {
    setAuditPage(1);
  }, [auditSearch, auditActionType, auditStatus]);

  useEffect(() => {
    if (isAdmin && (activeTab === 'users' || activeTab === 'analytics')) {
      const fetchUsersComplete = async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
          const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
          const response = await axios.get(`${API_BASE_URL}/admin/users-complete`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setUsersComplete(response.data.users || []);
          setUsersAnalytics(response.data.analytics || null);
        } catch (err) {
          console.error("Error fetching complete users list:", err);
          setUsersError("Failed to fetch customer data. Make sure you are authorized as admin.");
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsersComplete();
    }
  }, [activeTab, isAdmin, usersRefreshTrigger]);

  const filteredUsers = usersComplete.filter(u => {
    const query = userSearchQuery.toLowerCase();
    const matchesSearch =
      (u.name || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      (u.mobile || '').toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (userFilter === 'active') return !u.is_blocked;
    if (userFilter === 'blocked') return u.is_blocked;
    if (userFilter === 'new') {
      const uDate = new Date(u.created_at);
      const now = new Date();
      return uDate.getMonth() === now.getMonth() && uDate.getFullYear() === now.getFullYear();
    }
    if (userFilter === 'with_orders') return u.total_orders > 0;
    if (userFilter === 'without_orders') return u.total_orders === 0;

    return true;
  });

  const indexOfLastItem = userPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const renderAddress = (addr) => {
    if (!addr) return 'N/A';
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.pincode,
      addr.country
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return { date: 'N/A', time: 'N/A' };
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) return { date: 'N/A', time: 'N/A' };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = months[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    const dateStr = `${d}-${m}-${y}`;

    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;

    return { date: dateStr, time: timeStr };
  };

  const renderAdminAnalytics = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">
          Admin Analytics Summary Cards
        </h2>
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Registered</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.total_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">New This Month</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.new_users_this_month ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Customers</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.active_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-rose-500/10 p-3 rounded-xl text-rose-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Blocked Users</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.blocked_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Revenue</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                ₹{(usersAnalytics?.total_revenue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" />
              <span>Audit Logs</span>
              <span className="px-2 py-0.5 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-full font-bold">
                {generalAuditLogs.length} total
              </span>
            </h2>

            {/* Audit Logs Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative min-w-[200px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* Action Type Dropdown */}
              <select
                value={auditActionType}
                onChange={(e) => setAuditActionType(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 dark:text-slate-200"
              >
                <option value="">All Action Types</option>
                {ACTION_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Status Dropdown */}
              <select
                value={auditStatus}
                onChange={(e) => setAuditStatus(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 dark:text-slate-200"
              >
                <option value="">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Timestamp</th>
                  <th className="pb-3 px-4">Admin Name</th>
                  <th className="pb-3 px-4">Action Type</th>
                  <th className="pb-3 px-4">Module</th>
                  <th className="pb-3 px-4">Details</th>
                  <th className="pb-3 pl-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                {generalAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-semibold">
                      No audit logs match the selected filters.
                    </td>
                  </tr>
                ) : (
                  (() => {
                    const startIndex = (auditPage - 1) * auditPerPage;
                    const paginatedLogs = generalAuditLogs.slice(startIndex, startIndex + auditPerPage);
                    return paginatedLogs.map((log) => {
                      // Action type styling helper
                      let actionBadgeColor = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                      const type = log.action_type || "";
                      if (type.includes("Added") || type.includes("Unblocked")) {
                        actionBadgeColor = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450";
                      } else if (type.includes("Deleted") || type.includes("Blocked") || type.includes("Cancelled")) {
                        actionBadgeColor = "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-455";
                      } else if (type.includes("Updated") || type.includes("Changed") || type.includes("Status")) {
                        actionBadgeColor = "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-455";
                      } else if (type.includes("Login") || type.includes("Logout")) {
                        actionBadgeColor = "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-450";
                      }

                      const { date, time } = formatDateTime(log.created_at);

                      return (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-all border-b border-slate-100 dark:border-slate-800/50">
                          <td className="py-3.5 pr-4 font-semibold text-slate-500 dark:text-slate-405 whitespace-nowrap">
                            {date} <span className="text-[10px] text-slate-400 font-normal">{time}</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-205">
                            {log.admin_username}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase whitespace-nowrap ${actionBadgeColor}`}>
                              {log.action_type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-405 font-medium whitespace-nowrap">
                            {log.module}
                          </td>
                          <td className="py-3.5 px-4 max-w-[280px] text-slate-600 dark:text-slate-350 truncate font-semibold" title={log.details}>
                            {log.details}
                          </td>
                          <td className="py-3.5 pl-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${log.status === 'Success'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-455'
                              }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      );
                    });
                  })()
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {generalAuditLogs.length > auditPerPage && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 text-xs">
              <span className="font-medium text-slate-400">
                Showing {((auditPage - 1) * auditPerPage) + 1} to {Math.min(auditPage * auditPerPage, generalAuditLogs.length)} of {generalAuditLogs.length} audit logs
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setAuditPage(prev => Math.max(prev - 1, 1))}
                  disabled={auditPage === 1}
                  className={`px-3 py-1.5 font-bold rounded-lg border border-slate-200 dark:border-slate-800 transition-all ${auditPage === 1
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setAuditPage(prev => Math.min(prev + 1, Math.ceil(generalAuditLogs.length / auditPerPage)))}
                  disabled={auditPage >= Math.ceil(generalAuditLogs.length / auditPerPage)}
                  className={`px-3 py-1.5 font-bold rounded-lg border border-slate-200 dark:border-slate-800 transition-all ${auditPage >= Math.ceil(generalAuditLogs.length / auditPerPage)
                      ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUsersData = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Registered</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.total_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-500">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">New This Month</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.new_users_this_month ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Customers</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.active_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4">
            <div className="bg-rose-500/10 p-3 rounded-xl text-rose-500">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Blocked Users</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                {usersAnalytics?.blocked_users ?? 0}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md flex items-center gap-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Revenue</span>
              <span className="text-xl font-black text-slate-850 dark:text-white mt-0.5 block">
                ₹{(usersAnalytics?.total_revenue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or mobile..."
              value={userSearchQuery}
              onChange={(e) => {
                setUserSearchQuery(e.target.value);
                setUserPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center justify-start lg:justify-end">
            {[
              { label: 'All Users', value: 'all' },
              { label: 'Active Users', value: 'active' },
              { label: 'Blocked Users', value: 'blocked' },
              { label: 'New Users', value: 'new' },
              { label: 'With Orders', value: 'with_orders' },
              { label: 'Without Orders', value: 'without_orders' }
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setUserFilter(f.value);
                  setUserPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${userFilter === f.value
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-850'
                  }`}
              >
                {f.label}
              </button>
            ))}

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-emerald-550 bg-emerald-500 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5 ml-0 lg:ml-2"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto relative">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-150 dark:border-slate-800 sticky top-0 z-10">
                <tr className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 font-bold">User ID</th>
                  <th className="py-4 px-6 font-bold">Full Name</th>
                  <th className="py-4 px-6 font-bold">Mobile Number</th>
                  <th className="py-4 px-6 font-bold">Email Address</th>
                  <th className="py-4 px-6 font-bold">Role</th>
                  <th className="py-4 px-6 font-bold">Address</th>
                  <th className="py-4 px-6 font-bold">Registration Date</th>
                  <th className="py-4 px-6 font-bold">Registration Time</th>
                  <th className="py-4 px-6 font-bold text-center">Total Orders</th>
                  <th className="py-4 px-6 font-bold text-center">Total Spending</th>
                  <th className="py-4 px-6 font-bold text-center">Pending Orders</th>
                  <th className="py-4 px-6 font-bold text-center">Delivered Orders</th>
                  <th className="py-4 px-6 font-bold">Account Status</th>
                  <th className="py-4 px-6 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="py-12 text-center text-slate-450 italic">
                      No users found matching current filters.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((u) => {
                    const { date, time } = formatDateTime(u.created_at);
                    const pendingOrdersCount = u.orders?.filter(o => o.order_status === 'Pending').length || 0;
                    const deliveredOrdersCount = u.orders?.filter(o => o.order_status === 'Delivered').length || 0;
                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-55/30 dark:hover:bg-slate-850/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-[10px] text-slate-400">
                          {u.id}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                          {u.name}
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-650 dark:text-slate-350">
                          {u.mobile}
                        </td>
                        <td className="py-4 px-6 text-slate-650 dark:text-slate-350">
                          {u.email}
                        </td>
                        <td className="py-4 px-6">
                          {u.is_admin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                              Customer
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 max-w-xs truncate text-slate-500 dark:text-slate-400" title={renderAddress(u.address)}>
                          {renderAddress(u.address)}
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono">
                          {date}
                        </td>
                        <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono">
                          {time}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-slate-700 dark:text-slate-300">
                          {u.total_orders || 0}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{(u.total_spent || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-amber-500">
                          {pendingOrdersCount}
                        </td>
                        <td className="py-4 px-6 text-center font-bold text-emerald-500">
                          {deliveredOrdersCount}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${u.is_blocked
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            }`}>
                            {u.is_blocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => setSelectedUserForDetails(u)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] text-slate-400">
                Showing <span className="font-bold text-slate-700 dark:text-slate-300">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {Math.min(indexOfLastItem, filteredUsers.length)}
                </span>{' '}
                of <span className="font-bold text-slate-700 dark:text-slate-300">{filteredUsers.length}</span> users
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUserPage(p => Math.max(1, p - 1))}
                  disabled={userPage === 1}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setUserPage(p)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${userPage === p
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setUserPage(p => Math.min(totalPages, p + 1))}
                  disabled={userPage === totalPages}
                  className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };



  const handleCategoryClick = useCallback((categoryName, source = 'grid') => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryName);
    }
    setSearchParams(newParams, { preventScrollReset: true });

    if (source === 'banner') {
      const allProductsHeading = document.getElementById('all-products-heading');
      if (allProductsHeading) {
        allProductsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searchParams, setSearchParams]);

  const [slides, setSlides] = useState([
    {
      title: "The Solitaire Diamond Collection",
      subtitle: "Eternal Brilliance, Handcrafted Elegance",
      desc: "Explore our signature 18k yellow gold and white gold diamond solitaire rings. Perfect for weddings, proposals, and lifetime memories.",
      badge: "RINGS",
      gradient: "from-[#3F1D5A] via-[#2C143F] to-[#1B0B26]",
      accent: "text-[#D4A75F]",
      btnText: "Shop Solitaires",
      btnLink: "/?category=Rings",
      catFilter: "Rings",
      image_url: "/luxury_solitaire_ring.png"
    },
    {
      title: "The Royal Empress Collection",
      subtitle: "Ornate Emerald & Pearl Artistry",
      desc: "Adorn yourself with masterfully crafted necklaces, chokers, and bridal neckwear set in solid 22k gold and premium gemstones.",
      badge: "NECKLACES",
      gradient: "from-[#3F1D5A] via-[#5C2E7E] to-[#3F1D5A]",
      accent: "text-[#D4A75F]",
      btnText: "Shop Necklaces",
      catFilter: "Necklaces",
      image_url: "/luxury_emerald_necklace.png"
    },
    {
      title: "Imperial Bridal Heirlooms",
      subtitle: "Maang Tikkas, Polki Sets & Rubies",
      desc: "Celebrate your grand day with timeless heirloom bridal sets, meticulously set with uncut Polki diamonds and fine rubies.",
      badge: "BRIDAL",
      gradient: "from-[#1B0B26] via-[#3F1D5A] to-[#1B0B26]",
      accent: "text-[#D4A75F]",
      btnText: "Explore Bridal Set",
      catFilter: "Bridal Collection",
      image_url: "/luxury_bridal_set.png"
    }
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannerRefreshTrigger, setBannerRefreshTrigger] = useState(0);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [allBanners, setAllBanners] = useState([]);
  const [isEditingBanner, setIsEditingBanner] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    button_text: '',
    button_link: '',
    image_url: '',
    background_style: 'from-[#3F1D5A] via-[#2C143F] to-[#1B0B26]',
    category: '',
    display_order: 0,
    is_active: true
  });
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [bannerError, setBannerError] = useState(null);
  const [bannerSuccess, setBannerSuccess] = useState(null);

  // GSAP 3D ScrollTrigger Animations
  useEffect(() => {
    if (bannersLoading) return;

    // 1. Hero Slider 3D Scroll tilt & zoom out on scroll down
    const heroSlider = document.querySelector('.hero-slider-container');
    if (heroSlider) {
      gsap.to(heroSlider, {
        scrollTrigger: {
          trigger: heroSlider,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        },
        scale: 0.92,
        rotateX: -10,
        opacity: 0.2,
        transformOrigin: 'center bottom',
        ease: 'none'
      });
    }

    // 2. Category Grid 3D flip-up reveal
    const catGrid = document.querySelector('.category-grid-container');
    const catCards = catGrid ? catGrid.querySelectorAll('.category-card-item') : [];
    if (catCards.length > 0) {
      gsap.fromTo(catCards, 
        { opacity: 0, y: 70, rotateX: -30, transformPerspective: 1000 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: catGrid,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 3. Product Cards 3D rotate-reveal stagger
    const prodGrid = document.querySelector('.product-grid');
    const prodCards = prodGrid ? prodGrid.querySelectorAll('.product-card-item') : [];
    if (prodCards.length > 0) {
      gsap.fromTo(prodCards,
        { opacity: 0, y: 60, rotateY: -15, scale: 0.95, transformPerspective: 1000 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          stagger: 0.08,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: prodGrid,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    return () => {
      // Clean up triggers related to these animations
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === heroSlider || t.vars.trigger === catGrid || t.vars.trigger === prodGrid) {
          t.kill();
        }
      });
    };
  }, [products, loading, activeTab, activeCategory, bannersLoading]);

  // Auto scroll slides
  useEffect(() => {
    if (slides.length === 0 || bannersLoading) return;
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, bannersLoading]);

  const handlePrevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setActiveSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const handleNextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setActiveSlide(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  // Fetch active banners from backend
  useEffect(() => {
    const fetchActiveBanners = async () => {
      setBannersLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/banners`);
        if (response.data && response.data.length > 0) {
          const mapped = response.data.map(b => {
            let img = b.image_url;
            if (!img) {
              if (b.title.includes("Solitaire") || b.category === "Rings") img = "/luxury_solitaire_ring.png";
              else if (b.title.includes("Empress") || b.category === "Necklaces") img = "/luxury_emerald_necklace.png";
              else if (b.title.includes("Bridal") || b.category === "Bridal Collection") img = "/luxury_bridal_set.png";
            }
            return {
              id: b.id,
              title: b.title,
              subtitle: b.subtitle,
              desc: b.description,
              badge: b.category || "Offer",
              gradient: b.background_style || "from-[#3F1D5A] via-[#2C143F] to-[#1B0B26]",
              accent: "text-[#D4A75F]",
              btnText: b.button_text || "Shop Now",
              btnLink: b.button_link || "/",
              catFilter: b.category || "All",
              image_url: img
            };
          });
          setSlides(mapped);
        } else {
          setSlides([
            {
              title: "The Solitaire Diamond Collection",
              subtitle: "Eternal Brilliance, Handcrafted Elegance",
              desc: "Explore our signature 18k yellow gold and white gold diamond solitaire rings. Perfect for weddings, proposals, and lifetime memories.",
              badge: "RINGS",
              gradient: "from-[#3F1D5A] via-[#2C143F] to-[#1B0B26]",
              accent: "text-[#D4A75F]",
              btnText: "Shop Solitaires",
              btnLink: "/?category=Rings",
              catFilter: "Rings",
              image_url: "/luxury_solitaire_ring.png"
            },
            {
              title: "The Royal Empress Collection",
              subtitle: "Ornate Emerald & Pearl Artistry",
              desc: "Adorn yourself with masterfully crafted necklaces, chokers, and bridal neckwear set in solid 22k gold and premium gemstones.",
              badge: "NECKLACES",
              gradient: "from-[#3F1D5A] via-[#5C2E7E] to-[#3F1D5A]",
              accent: "text-[#D4A75F]",
              btnText: "Shop Necklaces",
              btnLink: "/?category=Necklaces",
              catFilter: "Necklaces",
              image_url: "/luxury_emerald_necklace.png"
            },
            {
              title: "Imperial Bridal Heirlooms",
              subtitle: "Maang Tikkas, Polki Sets & Rubies",
              desc: "Celebrate your grand day with timeless heirloom bridal sets, meticulously set with uncut Polki diamonds and fine rubies.",
              badge: "BRIDAL",
              gradient: "from-[#1B0B26] via-[#3F1D5A] to-[#1B0B26]",
              accent: "text-[#D4A75F]",
              btnText: "Explore Bridal Set",
              btnLink: "/?category=Bridal Collection",
              catFilter: "Bridal Collection",
              image_url: "/luxury_bridal_set.png"
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching active banners from backend:", err);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchActiveBanners();
  }, [bannerRefreshTrigger]);

  const fetchAllBanners = async () => {
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/banners/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAllBanners(response.data || []);
    } catch (err) {
      console.error("Error fetching all banners for admin:", err);
      setBannerError("Failed to fetch all banners.");
    }
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBannerImage(true);
    setBannerError(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/admin/upload-banner-image`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setBannerForm(prev => ({ ...prev, image_url: response.data.image_url }));
      setBannerSuccess("Image uploaded successfully!");
    } catch (err) {
      console.error("Error uploading banner image:", err);
      setBannerError(err.response?.data?.message || "Failed to upload banner image.");
    } finally {
      setUploadingBannerImage(false);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setBannerError(null);
    setBannerSuccess(null);
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      const payload = {
        title: bannerForm.title,
        subtitle: bannerForm.subtitle,
        description: bannerForm.description,
        button_text: bannerForm.button_text,
        button_link: bannerForm.button_link,
        image_url: bannerForm.image_url,
        background_style: bannerForm.background_style,
        category: bannerForm.category,
        display_order: parseInt(bannerForm.display_order) || 0,
        is_active: bannerForm.is_active
      };

      let res;
      if (editingBannerId) {
        res = await axios.put(`${API_BASE_URL}/admin/banners/${editingBannerId}`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBannerSuccess("Banner slide updated successfully!");
      } else {
        res = await axios.post(`${API_BASE_URL}/admin/banners`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBannerSuccess("Banner slide created successfully!");
      }
      setIsEditingBanner(false);
      setEditingBannerId(null);
      setBannerRefreshTrigger(prev => prev + 1);
      fetchAllBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      setBannerError(err.response?.data?.message || "Failed to save banner slide.");
    }
  };

  const startEditBanner = (banner) => {
    setEditingBannerId(banner.id);
    setBannerForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      button_text: banner.button_text || 'Shop Now',
      button_link: banner.button_link || '',
      image_url: banner.image_url || '',
      background_style: banner.background_style || 'from-slate-900 via-indigo-950 to-slate-900',
      category: banner.category || '',
      display_order: banner.display_order || 1,
      is_active: banner.is_active !== undefined ? banner.is_active : true
    });
    setIsEditingBanner(true);
    setBannerError(null);
    setBannerSuccess(null);
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner slide?")) return;
    setBannerError(null);
    setBannerSuccess(null);
    try {
      const token = localStorage.getItem('bb_token') || localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/admin/banners/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setBannerSuccess("Banner deleted successfully!");
      setBannerRefreshTrigger(prev => prev + 1);
      fetchAllBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
      setBannerError(err.response?.data?.message || "Failed to delete banner.");
    }
  };

  useEffect(() => {
    if (isAdmin && isBannerModalOpen) {
      fetchAllBanners();
    }
  }, [isAdmin, isBannerModalOpen]);

  // Fetch products from backend APIs
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/products`;
        const params = [];
        if (activeCategory && activeCategory !== 'All') {
          params.push(`category=${encodeURIComponent(activeCategory)}`);
        }
        if (activeSearch) {
          params.push(`search=${encodeURIComponent(activeSearch)}`);
        }
        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        const response = await axios.get(url);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Could not connect to the backend server. Make sure MongoDB and the Flask app are running.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, activeSearch, language, refreshTrigger]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-16">

      <BannerSlider
        slides={slides}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        isAdmin={isAdmin}
        handleNextSlide={handleNextSlide}
        handlePrevSlide={handlePrevSlide}
        opacityParallax={opacityParallax}
        yParallax={yParallax}
        bannersLoading={bannersLoading}
        onCategoryClick={handleCategoryClick}
      />

      <CategoryGrid 
        activeCategory={activeCategory} 
        loading={loading} 
        onCategoryClick={handleCategoryClick}
      />


      {/* Main Content Area */}
      <div id="all-products-heading" className="w-full max-w-[97%] mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Title / Filter Info */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 border-b border-slate-200/50 dark:border-slate-800 pb-4">
          <div>
            {isAdmin ? (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-2">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'products'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  All Products
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'users'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  Users Data
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'analytics'
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                >
                  Admin Analytics
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  {activeSearch ? `Search Results for "${activeSearch}"` : `${activeCategory} Products`}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Showing premium handpicked items in stock.
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0 self-end sm:self-auto relative">
            {activeCategory !== 'All' && activeTab === 'products' && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick('All');
                }}
                className="text-xs text-[#D4A75F] hover:text-[#B38F4B] hover:underline font-bold transition-colors"
              >
                Clear filters
              </button>
            )}

            {isAdmin && (
              <Link
                to="/admin-control"
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white border border-slate-900 dark:bg-[#1E1E1E] dark:border-[#D4A75F] dark:text-[#FFFFFF] rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 dark:hover:bg-[#2A2A2A] dark:hover:border-[#D4A75F] dark:shadow-[0_4px_15px_rgba(212,167,95,0.25)] transition-all cursor-pointer"
                id="admin-control-btn"
              >
                <span>Admin Control</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Loading Skeletons */}
        {activeTab === 'products' && loading && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        )}

        {/* Error State */}
        {activeTab === 'products' && error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center max-w-xl mx-auto my-12">
            <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">Failed to Load Products</h3>
            <p className="text-slate-555 dark:text-slate-400 text-sm mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {activeTab === 'products' && !loading && !error && products.length === 0 && (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mt-4">No Products Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              We couldn't find any products matching your current category filter or search query.
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick('All');
              }}
              className="mt-6 px-5 py-2 bg-[#D4A75F] hover:bg-[#B38F4B] text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              View All Products
            </button>
          </div>
        )}

        {/* Product Grid */}
        {activeTab === 'products' && !loading && !error && products.length > 0 && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="product-grid"
          >
            {products.map(product => (
              <div key={product._id} className="product-card-item">
                <ProductCard
                  key={product._id}
                  product={product}
                  onAdminAction={(productId) => setSelectedAdminProductId(productId)}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Users Data Tab Content */}
        {isAdmin && activeTab === 'users' && (
          usersLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <p className="text-slate-550 dark:text-slate-400 mt-4 text-sm font-semibold">Loading customer database...</p>
            </div>
          ) : usersError ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center max-w-xl mx-auto my-12">
              <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">Error Loading Users</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm mt-2">{usersError}</p>
              <button
                onClick={() => {
                  setActiveTab('products');
                  setTimeout(() => setActiveTab('users'), 50);
                }}
                className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : (
            renderUsersData()
          )
        )}

        {/* Admin Analytics Tab Content */}
        {isAdmin && activeTab === 'analytics' && (
          usersLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <p className="text-slate-500 dark:text-slate-400 mt-4 text-sm font-semibold">Loading analytics...</p>
            </div>
          ) : usersError ? (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6 text-center max-w-xl mx-auto my-12">
              <h3 className="text-red-600 dark:text-red-400 font-bold text-lg">Error Loading Analytics</h3>
              <p className="text-slate-550 dark:text-slate-400 text-sm mt-2">{usersError}</p>
            </div>
          ) : (
            renderAdminAnalytics()
          )
        )}
      </div>

      {/* Admin Panel Modal */}
      {selectedAdminProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 transform scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🛠️</span>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100 tracking-wide uppercase">
                  Inline Admin Management
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedAdminProductId(null);
                  setRefreshTrigger(prev => prev + 1);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-6 bg-slate-50 dark:bg-slate-950">
              <ProductDetails productId={selectedAdminProductId} />
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-all transform scale-100">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-850 dark:text-slate-100">Add New User Account</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Create a new customer or admin user in the system</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setAddUserError(null);
                  setAddUserSuccess(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleCreateUserSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {addUserError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl text-rose-500 text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <span>{addUserError}</span>
                </div>
              )}

              {addUserSuccess && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-500 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span>{addUserSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={addUserForm.name}
                    onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={addUserForm.email}
                    onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={addUserForm.mobile}
                    onChange={(e) => setAddUserForm({ ...addUserForm, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Role *</label>
                  <select
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={addUserForm.password}
                    onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={addUserForm.confirm_password}
                    onChange={(e) => setAddUserForm({ ...addUserForm, confirm_password: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Address Fields Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-3">
                <h4 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">Address Details</h4>

                {/* Street Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Street Address</label>
                  <input
                    type="text"
                    placeholder="Flat, House no., Building, Company, Apartment, Street"
                    value={addUserForm.address}
                    onChange={(e) => setAddUserForm({ ...addUserForm, address: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={addUserForm.city}
                      onChange={(e) => setAddUserForm({ ...addUserForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={addUserForm.state}
                      onChange={(e) => setAddUserForm({ ...addUserForm, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  {/* Pincode */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={addUserForm.pincode}
                      onChange={(e) => setAddUserForm({ ...addUserForm, pincode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/35 text-xs text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setAddUserError(null);
                    setAddUserSuccess(null);
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUserLoading}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
                >
                  {addUserLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save User</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected User Details Modal */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 transform scale-100">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 font-black text-base">
                  {selectedUserForDetails.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100">
                    Customer Details & History
                  </h3>
                  <p className="text-[10px] text-slate-405">
                    User ID: {selectedUserForDetails.id} • {selectedUserForDetails.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950">

              {/* User Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Orders</span>
                    <span className="text-sm font-black text-slate-850 dark:text-white">
                      {selectedUserForDetails.total_orders} orders
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-500">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Spending</span>
                    <span className="text-sm font-black text-slate-850 dark:text-white">
                      ₹{selectedUserForDetails.total_spent.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
                  <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Last Order Date</span>
                    <span className="text-sm font-black text-slate-855 dark:text-white">
                      {selectedUserForDetails.last_order_date ? formatDateTime(selectedUserForDetails.last_order_date).date : 'No orders'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-805 dark:text-slate-200 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>Delivery Address Details</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-450 block font-bold">Full Address</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{selectedUserForDetails.address?.street || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 block font-bold">City</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{selectedUserForDetails.address?.city || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 block font-bold">State</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{selectedUserForDetails.address?.state || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-450 block font-bold">Pincode / Country</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">
                      {selectedUserForDetails.address?.pincode || 'N/A'} • {selectedUserForDetails.address?.country || 'India'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order History Table */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  <span>Complete Order History ({selectedUserForDetails.orders?.length || 0})</span>
                </h4>

                {(!selectedUserForDetails.orders || selectedUserForDetails.orders.length === 0) ? (
                  <p className="text-xs text-slate-450 italic py-4">No order history found for this customer.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                          <th className="py-3 px-2">Order ID</th>
                          <th className="py-3 px-2">Products</th>
                          <th className="py-3 px-2 text-center">Quantity</th>
                          <th className="py-3 px-2 text-right">Amount</th>
                          <th className="py-3 px-2 text-center">Payment Method</th>
                          <th className="py-3 px-2 text-center">Order Date</th>
                          <th className="py-3 px-2 text-center">Order Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {selectedUserForDetails.orders.map((order, oIdx) => {
                          const { date } = formatDateTime(order.created_at);
                          return (
                            <tr key={oIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                              <td className="py-3 px-2 font-mono text-[11px] text-slate-450">
                                {order.order_id}
                              </td>
                              <td className="py-3 px-2 max-w-xs">
                                {order.items?.map((item, iIdx) => (
                                  <div key={iIdx} className="flex items-center gap-2 my-1">
                                    {item.image && (
                                      <img src={item.image} alt={item.name} className="w-7 h-7 object-cover rounded-lg border border-slate-200/50 dark:border-slate-800" />
                                    )}
                                    <span className="font-bold text-slate-700 dark:text-slate-200 truncate block max-w-[180px]">
                                      {item.name}
                                    </span>
                                  </div>
                                ))}
                              </td>
                              <td className="py-3 px-2 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                                {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                              </td>
                              <td className="py-3 px-2 text-right font-black text-emerald-500 font-mono">
                                ₹{order.total_amount.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-2 text-center text-slate-500 dark:text-slate-400 font-bold">
                                {order.payment_method}
                              </td>
                              <td className="py-3 px-2 text-center text-slate-450 font-mono">
                                {date}
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.order_status === 'Delivered'
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : order.order_status === 'Cancelled'
                                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                      : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  }`}>
                                  {order.order_status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Banner Management Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🖼️</span>
                <h3 className="font-extrabold text-base text-slate-850 dark:text-slate-100 tracking-wide uppercase">
                  Homepage Banner Slider Management
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsBannerModalOpen(false);
                  setIsEditingBanner(false);
                  setEditingBannerId(null);
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-955">
              {bannerError && (
                <div className="mb-4 p-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-xs font-semibold">
                  {bannerError}
                </div>
              )}
              {bannerSuccess && (
                <div className="mb-4 p-3.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl text-xs font-semibold">
                  {bannerSuccess}
                </div>
              )}

              {!isEditingBanner ? (
                // Banner List View
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure background gradients, titles, images, and display order of slides rendered on the store homepage hero banner.
                    </p>
                    <button
                      onClick={() => {
                        setEditingBannerId(null);
                        setBannerForm({
                          title: '',
                          subtitle: '',
                          description: '',
                          button_text: 'Shop Now',
                          button_link: '',
                          image_url: '',
                          background_style: 'from-slate-900 via-indigo-950 to-slate-900',
                          category: '',
                          display_order: allBanners.length + 1,
                          is_active: true
                        });
                        setIsEditingBanner(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create New Banner</span>
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {allBanners.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                        <span className="text-3xl block mb-2">📭</span>
                        <p className="text-xs">No custom banners created yet. The homepage will display standard seeded/fallback slides.</p>
                      </div>
                    ) : (
                      allBanners.map((banner) => (
                        <div
                          key={banner.id}
                          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            {/* Gradient preview circle */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${banner.background_style} flex items-center justify-center border border-white/10 flex-shrink-0`}>
                              {banner.image_url ? (
                                <img src={banner.image_url} alt="" className="w-10 h-10 object-contain rounded" />
                              ) : (
                                <span className="text-white text-xs font-bold font-mono">B</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">
                                  {banner.title}
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${banner.is_active
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                  }`}>
                                  {banner.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-450 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {banner.subtitle || banner.description || 'No subtitle/description'}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 font-semibold">
                                <span>Order: <strong className="text-slate-600 dark:text-slate-200">{banner.display_order}</strong></span>
                                <span>•</span>
                                <span>Category: <strong className="text-slate-600 dark:text-slate-200">{banner.category || 'All'}</strong></span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditBanner(banner)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-xl transition-all cursor-pointer"
                              title="Edit Banner"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBanner(banner.id)}
                              className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl transition-all cursor-pointer"
                              title="Delete Banner"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                // Banner Create/Edit Form View
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                      {editingBannerId ? '✏ Edit Slide Details' : '✨ Create New Banner Slide'}
                    </h4>
                    <button
                      onClick={() => {
                        setIsEditingBanner(false);
                        setEditingBannerId(null);
                      }}
                      className="text-xs font-bold text-slate-500 hover:text-slate-750 dark:hover:text-slate-200 cursor-pointer"
                    >
                      ← Back to list
                    </button>
                  </div>

                  {/* Live Preview Container */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg bg-slate-900 relative">
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-500/20">
                      Live Preview
                    </div>
                    <div className={`bg-gradient-to-r ${bannerForm.background_style} flex items-center justify-between p-6 sm:p-8 min-h-[160px] sm:min-h-[220px] transition-all duration-300`}>
                      <div className="flex-1 text-white pr-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-emerald-400 border border-white/10 w-fit mb-2">
                          <Sparkles className="h-3 w-3" />
                          {bannerForm.category || 'Special Offer'}
                        </span>
                        <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-tight line-clamp-1">
                          {bannerForm.title || 'Enter Title...'}
                        </h2>
                        <h3 className="text-xs sm:text-sm font-bold text-emerald-400 line-clamp-1 mt-0.5">
                          {bannerForm.subtitle || 'Enter Subtitle...'}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-300 mt-1.5 max-w-md line-clamp-2">
                          {bannerForm.description || 'Enter Description details here...'}
                        </p>
                        <span className="mt-3 inline-block px-4 py-1.5 bg-emerald-500 text-white rounded-xl font-bold text-[10px] shadow-sm select-none">
                          {bannerForm.button_text || 'Shop Now'}
                        </span>
                      </div>
                      {bannerForm.image_url && (
                        <div className="flex-shrink-0 w-24 sm:w-36 h-24 sm:h-36 flex items-center justify-center">
                          <img
                            src={bannerForm.image_url}
                            alt=""
                            className="max-h-full w-auto object-contain rounded-xl shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSaveBanner} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inputs Left */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Banner Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={bannerForm.title}
                          onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="e.g. SSJewellery Big Savings Day"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Banner Subtitle
                        </label>
                        <input
                          type="text"
                          value={bannerForm.subtitle}
                          onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="e.g. Experience Premium Audio Gear"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          value={bannerForm.description}
                          onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          placeholder="e.g. Get flat 15% off on Active Noise-Cancelling Headphones."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={bannerForm.button_text}
                            onChange={(e) => setBannerForm({ ...bannerForm, button_text: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="e.g. Shop Now"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Button Redirect Link
                          </label>
                          <input
                            type="text"
                            value={bannerForm.button_link}
                            onChange={(e) => setBannerForm({ ...bannerForm, button_link: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="e.g. /?category=Electronics"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inputs Right */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Category / Badge Accent
                        </label>
                        <select
                          value={bannerForm.category}
                          onChange={(e) => setBannerForm({ ...bannerForm, category: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="">Choose Category...</option>
                          <option value="Rings">Rings</option>
                          <option value="Necklaces">Necklaces</option>
                          <option value="Earrings">Earrings</option>
                          <option value="Bracelets">Bracelets</option>
                          <option value="Bangles">Bangles</option>
                          <option value="Bridal Collection">Bridal Collection</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={bannerForm.display_order}
                            onChange={(e) => setBannerForm({ ...bannerForm, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>

                        <div className="flex items-center h-full pt-6">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={bannerForm.is_active}
                              onChange={(e) => setBannerForm({ ...bannerForm, is_active: e.target.checked })}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Enable Slide</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Background Gradient Style
                        </label>
                        <select
                          value={bannerForm.background_style}
                          onChange={(e) => setBannerForm({ ...bannerForm, background_style: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 mb-2"
                        >
                          <option value="from-slate-900 via-indigo-950 to-slate-900">Indigo Dark</option>
                          <option value="from-slate-900 via-emerald-950 to-slate-900">Emerald Dark</option>
                          <option value="from-slate-900 via-rose-950 to-slate-900">Rose Dark</option>
                          <option value="from-slate-900 via-purple-950 to-slate-900">Purple Dark</option>
                          <option value="from-slate-900 via-amber-950 to-slate-900">Amber Dark</option>
                          <option value="from-slate-900 via-teal-950 to-slate-900">Teal Dark</option>
                        </select>
                        <input
                          type="text"
                          value={bannerForm.background_style}
                          onChange={(e) => setBannerForm({ ...bannerForm, background_style: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono"
                          placeholder="Or enter custom Tailwind CSS gradient classes"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Slide Image
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={bannerForm.image_url}
                            onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="Image URL (e.g. https://... or leave empty)"
                          />
                          <label className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-xs font-extrabold cursor-pointer border border-slate-200 dark:border-slate-850 h-[38px] min-w-[100px] text-center whitespace-nowrap">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingBannerImage ? '...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBannerImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {bannerForm.image_url && (
                          <button
                            type="button"
                            onClick={() => setBannerForm({ ...bannerForm, image_url: '' })}
                            className="text-[10px] text-rose-500 hover:underline mt-1 font-bold block"
                          >
                            Delete Current Image
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingBanner(false);
                          setEditingBannerId(null);
                        }}
                        className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Save Slide
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
