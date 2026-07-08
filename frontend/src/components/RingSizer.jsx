import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const RingSizer = () => {
  const { language } = useTranslation();
  const [activeStep, setActiveStep] = useState('calibrate'); // 'calibrate' or 'measure'
  
  // Calibration: standard credit card width is 85.6 mm
  const [cardWidthPx, setCardWidthPx] = useState(250); 
  const ppi = useMemo(() => cardWidthPx / 85.6, [cardWidthPx]); // Pixels per millimeter

  // Measuring circle diameter in mm
  const [ringDiameterMm, setRingDiameterMm] = useState(16.5); // Default size 12 in India (16.5mm)

  // Standard Indian / US Ring Size Chart
  const sizeChart = [
    { in: 6, us: 3.5, dia: 14.6 },
    { in: 8, us: 4.5, dia: 15.3 },
    { in: 10, us: 5.5, dia: 15.9 },
    { in: 12, us: 6.5, dia: 16.5 },
    { in: 14, us: 7.0, dia: 17.2 },
    { in: 16, us: 8.0, dia: 17.8 },
    { in: 18, us: 8.5, dia: 18.5 },
    { in: 20, us: 9.5, dia: 19.1 },
    { in: 22, us: 10.0, dia: 19.8 },
    { in: 24, us: 11.0, dia: 20.4 }
  ];

  const closestSize = useMemo(() => {
    let closest = sizeChart[0];
    let minDiff = Math.abs(ringDiameterMm - closest.dia);

    for (let i = 1; i < sizeChart.length; i++) {
      const diff = Math.abs(ringDiameterMm - sizeChart[i].dia);
      if (diff < minDiff) {
        minDiff = diff;
        closest = sizeChart[i];
      }
    }
    return closest;
  }, [ringDiameterMm]);

  // Translations
  const text = {
    en: {
      title: "Interactive Ring Size Finder",
      subtitle: "Determine your accurate ring size using your screen",
      tabCalibrate: "1. Calibrate Screen",
      tabMeasure: "2. Measure Ring",
      calibInstruction: "Place a physical credit card or ID card flat against your screen. Adjust the slider until the blue outline on the screen matches the size of your physical card exactly.",
      sliderCalibLabel: "Adjust Screen Scale",
      btnNext: "Proceed to Measuring",
      measureInstruction: "Place one of your existing rings flat on the screen. Adjust the slider below until the golden circle aligns perfectly with the INSIDE of your ring.",
      sliderMeasureLabel: "Adjust Ring Diameter",
      resultsTitle: "Your Estimated Ring Size",
      diameter: "Inner Diameter",
      sizeIndia: "Indian Size",
      sizeUS: "US Size",
      calibrationStatus: "Screen Calibrated successfully",
      calibDone: "Next Step"
    },
    hi: {
      title: "इंटरएक्टिव रिंग साइज फाइंडर",
      subtitle: "अपनी स्क्रीन का उपयोग करके अपनी रिंग का सही आकार जानें",
      tabCalibrate: "1. स्क्रीन कैलिब्रेशन",
      tabMeasure: "2. अंगूठी का माप",
      calibInstruction: "अपनी स्क्रीन पर एक भौतिक क्रेडिट कार्ड या आईडी कार्ड रखें। नीचे दिए गए स्लाइडर को तब तक समायोजित करें जब तक कि स्क्रीन पर नीली रूपरेखा आपके भौतिक कार्ड के आकार से पूरी तरह मेल न खा जाए।",
      sliderCalibLabel: "स्क्रीन स्केल समायोजित करें",
      btnNext: "मापने के लिए आगे बढ़ें",
      measureInstruction: "अपनी किसी मौजूदा अंगूठी को स्क्रीन पर सीधा रखें। नीचे दिए गए स्लाइडर को तब तक समायोजित करें जब तक कि सुनहरा चक्र आपकी अंगूठी के भीतर के हिस्से से पूरी तरह संरेखित न हो जाए।",
      sliderMeasureLabel: "अंगूठी का व्यास समायोजित करें",
      resultsTitle: "आपका अनुमानित अंगूठी का आकार",
      diameter: "आंतरिक व्यास",
      sizeIndia: "भारतीय आकार",
      sizeUS: "अमेरिकी आकार",
      calibrationStatus: "स्क्रीन कैलिब्रेशन सफल रहा",
      calibDone: "अगला चरण"
    }
  }[language === 'hi' ? 'hi' : 'en'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-[#D4A75F]/20 rounded-3xl p-6 sm:p-10 shadow-xl transition-colors duration-300">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-amber-500/10 text-[#D4A75F] mb-3">
            <Ruler className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif text-slate-850 dark:text-[#EFE7DB] tracking-wide">
            {text.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {text.subtitle}
          </p>
        </div>

        {/* Steps Tab Headers */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveStep('calibrate')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeStep === 'calibrate'
                ? 'border-[#D4A75F] text-[#D4A75F]'
                : 'border-transparent text-slate-450 dark:text-slate-500 hover:text-slate-805'
            }`}
          >
            {text.tabCalibrate}
          </button>
          <button
            onClick={() => setActiveStep('measure')}
            className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeStep === 'measure'
                ? 'border-[#D4A75F] text-[#D4A75F]'
                : 'border-transparent text-slate-450 dark:text-slate-500 hover:text-slate-805'
            }`}
          >
            {text.tabMeasure}
          </button>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[300px]">
          
          {/* Visual Display side (Col 6) */}
          <div className="lg:col-span-6 flex justify-center items-center bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/50 rounded-2xl p-6 sm:p-10 min-h-[280px]">
            <AnimatePresence mode="wait">
              {activeStep === 'calibrate' ? (
                <motion.div
                  key="calib-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  {/* Credit Card Outline representation */}
                  <motion.div
                    style={{ width: `${cardWidthPx}px`, height: `${cardWidthPx * 0.63}px` }}
                    className="border-2 border-dashed border-blue-500/80 bg-blue-500/5 rounded-xl flex flex-col items-center justify-center relative shadow-inner max-w-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <span className="text-[10px] sm:text-xs font-black text-blue-500 tracking-wider">CREDIT / DEBIT CARD</span>
                    <Maximize2 className="h-4 w-4 text-blue-400 absolute bottom-3 right-3 animate-pulse" />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="measure-box"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center"
                >
                  {/* Measuring Ring Template */}
                  <div className="relative flex items-center justify-center w-60 h-60 border border-dashed border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900/60 shadow-inner">
                    <motion.div
                      style={{
                        width: `${ringDiameterMm * ppi}px`,
                        height: `${ringDiameterMm * ppi}px`
                      }}
                      className="rounded-full border-4 border-[#D4A75F] bg-amber-500/10 shadow-[0_0_15px_rgba(212,167,95,0.45)] relative flex items-center justify-center"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      <div className="absolute inset-2 rounded-full border border-[#D4A75F]/20 border-dashed" />
                      <Sparkles className="h-4 w-4 text-[#D4A75F] opacity-75" />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive controls side (Col 6) */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeStep === 'calibrate' ? (
                <motion.div
                  key="calib-controls"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h3 className="text-sm font-bold text-slate-800 dark:text-[#EFE7DB] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    {text.tabCalibrate}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                    {text.calibInstruction}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{text.sliderCalibLabel}</span>
                      <span className="text-[#D4A75F]">{cardWidthPx}px</span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="380"
                      value={cardWidthPx}
                      onChange={(e) => setCardWidthPx(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4A75F]"
                    />
                  </div>

                  <button
                    onClick={() => setActiveStep('measure')}
                    className="w-full py-3.5 bg-[#D4A75F] hover:bg-[#B38F4B] text-slate-950 hover:text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all duration-300 uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {text.btnNext}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="measure-controls"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-sm font-bold text-[#D4A75F] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A75F]" />
                    {text.tabMeasure}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                    {text.measureInstruction}
                  </p>

                  {/* Ring Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                      <span>{text.sliderMeasureLabel}</span>
                      <span className="text-[#D4A75F]">{ringDiameterMm.toFixed(1)} mm</span>
                    </div>
                    <input
                      type="range"
                      min="13.0"
                      max="22.0"
                      step="0.1"
                      value={ringDiameterMm}
                      onChange={(e) => setRingDiameterMm(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4A75F]"
                    />
                  </div>

                  {/* Size Output Box */}
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                      {text.resultsTitle}
                    </h4>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2.5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                        <span className="text-[10px] text-slate-450 block uppercase tracking-wide">{text.diameter}</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 block">{closestSize.dia.toFixed(1)} mm</span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl shadow-md shadow-[#D4A75F]/5">
                        <span className="text-[10px] text-slate-450 block uppercase tracking-wide">{text.sizeIndia}</span>
                        <span className="text-base font-black text-[#D4A75F] mt-1 block">{closestSize.in}</span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl">
                        <span className="text-[10px] text-slate-450 block uppercase tracking-wide">{text.sizeUS}</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200 mt-1 block">{closestSize.us}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </motion.section>
  );
};
