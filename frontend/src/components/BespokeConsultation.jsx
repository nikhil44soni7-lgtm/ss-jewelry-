import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const BespokeConsultation = () => {
  const { language } = useTranslation();
  const [step, setStep] = useState(1); // 1: Metal, 2: Gemstone, 3: Budget

  const [preferences, setPreferences] = useState({
    metal: '22K Yellow Gold',
    gemstone: 'Diamond',
    budget: '₹50k - ₹1.5 Lakhs'
  });

  // Mappings
  const metals = [
    { name: '22K Yellow Gold', name_hi: '22K पीला सोना', desc: 'Classic traditional gold brilliance' },
    { name: '18K Rose Gold', name_hi: '18K रोज गोल्ड', desc: 'Modern romantic blushing copper-gold' },
    { name: '18K White Gold', name_hi: '18K सफेद सोना', desc: 'Sleek contemporary silver-gold finish' },
    { name: '950 Platinum', name_hi: '950 प्लेटिनम', desc: 'Ultimate pure and heavy luxury white metal' }
  ];

  const gemstones = [
    { name: 'Diamond Solitaire', name_hi: 'हीरा सॉलिटेयर', desc: 'Timeless certified premium diamond cuts' },
    { name: 'Colombian Emerald', name_hi: 'कोलम्बियन पन्ना', desc: 'Rich velvet royal green precious stone' },
    { name: 'Blue Sapphire', name_hi: 'नीलम', desc: 'Vibrant majestic deep indigo-blue gemstone' },
    { name: 'Plain Metal (No Gemstone)', name_hi: 'सादा धातु (कोई रत्न नहीं)', desc: 'Elegant and clean metal carving focus' }
  ];

  const budgets = [
    { label: '₹30K - ₹80K', desc: 'Minimalist engagement bands & light pendants' },
    { label: '₹80K - ₹2.5 Lakhs', desc: 'Premium bridal rings & classic necklaces' },
    { label: '₹2.5 Lakhs - ₹7 Lakhs', desc: 'Intricate royal sets & high-carat diamonds' },
    { label: '₹7 Lakhs+ (Bespoke Luxury)', desc: 'Custom heirloom investment designs' }
  ];

  // Translations
  const text = {
    en: {
      title: "Bespoke Jewelry Consultation",
      subtitle: "Collaborate with SSJewellery designers to craft custom heirlooms",
      stepTitle: ["Select Metal base", "Choose Gemstone Style", "Estimate Budget tier"],
      next: "Continue",
      prev: "Back",
      submit: "Book consultation via WhatsApp",
      metalLabel: "Metal Purity",
      gemstoneLabel: "Gemstone Cut",
      budgetLabel: "Target Budget",
      summaryTitle: "Bespoke Jewelry Request",
      summaryDesc: "Verify your specifications before booking your slot with our design team:"
    },
    hi: {
      title: "बेस्पोक कस्टम आभूषण परामर्श",
      subtitle: "शाश्वत कस्टम आभूषणों को डिजाइन करने के लिए एसएसज्वेलरी डिजाइनरों से जुड़ें",
      stepTitle: ["धातु बेस चुनें", "रत्न शैली चुनें", "बजट श्रेणी चुनें"],
      next: "आगे बढ़ें",
      prev: "पीछे जाएं",
      submit: "व्हाट्सएप द्वारा परामर्श बुक करें",
      metalLabel: "धातु शुद्धता",
      gemstoneLabel: "रत्न शैली",
      budgetLabel: "लक्षित बजट",
      summaryTitle: "बेस्पोक आभूषण अनुरोध",
      summaryDesc: "हमारे डिजाइनरों के साथ स्लॉट बुक करने से पहले अपने विनिर्देशों को सत्यापित करें:"
    }
  }[language === 'hi' ? 'hi' : 'en'];

  // Trigger whatsapp redirect
  const handleWhatsAppBook = () => {
    const phone = '919876543210'; // SSJewellery custom support number
    const message = `Hi SSJewellery, I would like to book a Bespoke Jewelry Design Consultation with the following selections:\n\n` +
      `- Metal Preference: ${preferences.metal}\n` +
      `- Gemstone Preference: ${preferences.gemstone}\n` +
      `- Estimated Budget Tier: ${preferences.budget}\n\n` +
      `Please let me know the available time slots. Thank you!`;
      
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-950/95 border border-[#D4A75F]/15 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Glow Background */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#3F1D5A]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4A75F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Form Wizard side (Col 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A75F]/10 text-[#D4A75F] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                BESPOKE DESIGN
              </div>
              <h2 className="text-xl sm:text-3xl font-bold font-serif text-[#EFE7DB] tracking-wide">
                {text.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
                {text.subtitle}
              </p>
            </div>

            {/* Stepper Progress dots */}
            <div className="flex items-center space-x-2.5">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s ? 'w-8 bg-[#D4A75F]' : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Wizard Steps Content */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide">
                      {text.stepTitle[0]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {metals.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => setPreferences({ ...preferences, metal: m.name })}
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-300 ${
                            preferences.metal === m.name
                              ? 'bg-[#D4A75F]/10 border-[#D4A75F] text-[#D4A75F]'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="block text-sm font-bold">{language === 'hi' ? m.name_hi : m.name}</span>
                          <span className="block text-[10px] text-slate-500 mt-1">{m.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide">
                      {text.stepTitle[1]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gemstones.map((g) => (
                        <button
                          key={g.name}
                          onClick={() => setPreferences({ ...preferences, gemstone: g.name })}
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-300 ${
                            preferences.gemstone === g.name
                              ? 'bg-[#D4A75F]/10 border-[#D4A75F] text-[#D4A75F]'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="block text-sm font-bold">{language === 'hi' ? g.name_hi : g.name}</span>
                          <span className="block text-[10px] text-slate-500 mt-1">{g.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide">
                      {text.stepTitle[2]}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {budgets.map((b) => (
                        <button
                          key={b.label}
                          onClick={() => setPreferences({ ...preferences, budget: b.label })}
                          className={`p-4 rounded-xl text-left border cursor-pointer transition-all duration-300 ${
                            preferences.budget === b.label
                              ? 'bg-[#D4A75F]/10 border-[#D4A75F] text-[#D4A75F]'
                              : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span className="block text-sm font-bold">{b.label}</span>
                          <span className="block text-[10px] text-slate-500 mt-1">{b.desc}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-bold text-slate-350 uppercase tracking-wide">
                      {text.summaryTitle}
                    </h3>
                    <p className="text-xs text-slate-500">{text.summaryDesc}</p>
                    
                    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3.5 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-2.5">
                        <span className="text-slate-500 uppercase font-bold tracking-wider">{text.metalLabel}</span>
                        <span className="text-slate-200 font-extrabold">{preferences.metal}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-800/60 pb-2.5">
                        <span className="text-slate-500 uppercase font-bold tracking-wider">{text.gemstoneLabel}</span>
                        <span className="text-slate-200 font-extrabold">{preferences.gemstone}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 uppercase font-bold tracking-wider">{text.budgetLabel}</span>
                        <span className="text-[#D4A75F] font-extrabold">{preferences.budget}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stepper Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3.5 bg-slate-900 text-slate-400 border border-slate-850 hover:border-slate-700 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                >
                  {text.prev}
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex-1 py-3.5 bg-[#D4A75F]/10 border border-[#D4A75F]/30 hover:bg-[#D4A75F]/20 text-[#D4A75F] rounded-xl text-xs font-bold transition-all uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {text.next}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleWhatsAppBook}
                  className="flex-1 py-4 bg-[#D4A75F] hover:bg-[#B38F4B] text-slate-950 hover:text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/5 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="h-4.5 w-4.5" />
                  {text.submit}
                </button>
              )}
            </div>

          </div>

          {/* Luxury Graphic Showcase (Col 5) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col justify-center items-center">
            <div className="relative border border-slate-800 bg-slate-900/40 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4 max-w-sm h-full w-full">
              <div className="p-4 rounded-full bg-amber-500/10 text-[#D4A75F] animate-pulse">
                <Calendar className="h-8 w-8" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#EFE7DB] tracking-wide">SS VIP DESIGN SUITE</h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
                Enjoy one-on-one virtual workspace design shares, digital mock renderings, and direct metal purity checks with certified gemologists.
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4A75F] to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};
