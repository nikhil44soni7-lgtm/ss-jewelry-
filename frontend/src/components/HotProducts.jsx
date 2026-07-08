import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Flame, RefreshCw } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { useTranslation } from '../hooks/useTranslation';
import { API_BASE_URL } from '../context/AuthContext';

export const HotProducts = () => {
  const { language } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        if (response.data && Array.isArray(response.data)) {
          // Filter active products, sort by rating descending, then discount descending
          const sorted = response.data
            .filter(p => p.status === 'active')
            .sort((a, b) => {
              const ratingDiff = (b.ratings || 0) - (a.ratings || 0);
              if (Math.abs(ratingDiff) > 0.01) return ratingDiff;
              return (b.discount || 0) - (a.discount || 0);
            });
          // Pick top 4 products
          setProducts(sorted.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load hot products:", err);
        setError("Unable to load trending products.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotProducts();
  }, []);

  const text = {
    en: {
      title: "Hot Selling Masterpieces",
      subtitle: "The most coveted, highly-rated designs from our collection",
      badge: "Trending Now",
      empty: "Loading best sellers..."
    },
    hi: {
      title: "लोकप्रिय हॉट सेलिंग उत्पाद",
      subtitle: "हमारे संग्रह से सबसे अधिक पसंद किए जाने वाले और उच्च श्रेणी के डिज़ाइन",
      badge: "अभी ट्रेंडिंग है",
      empty: "सर्वश्रेष्ठ बिकने वाले उत्पाद लोड हो रहे हैं..."
    }
  }[language === 'hi' ? 'hi' : 'en'];

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="h-4 w-4" />
            {text.badge}
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-serif text-[#3F1D5A] dark:text-[#EFE7DB]">
            {text.title}
          </h2>
        </div>
        <div className="product-grid">
          {[1, 2, 3, 4].map(idx => (
            <ProductCardSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return null; // Fail silently or do not block layout
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
    >
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-3 animate-pulse">
          <Flame className="h-4 w-4 fill-current" />
          {text.badge}
        </div>
        <h2 className="text-xl sm:text-3xl font-bold font-serif text-[#3F1D5A] dark:text-[#EFE7DB] tracking-wide relative inline-block pb-3">
          {text.title}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          {text.subtitle}
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
