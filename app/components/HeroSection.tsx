'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0C0C0C]">
      
      {/* Autoplay Muted Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        {/* Replace with your high-res cinematic pouring video */}
        <source src="/videos/whiskey-pour-dark.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0C0C0C]"></div>

      {/* Glassmorphic Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="max-w-4xl p-10 md:p-16 border rounded-3xl bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl"
        >
          
          {/* Luxury Typography */}
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-wide leading-tight">
            Where Premium <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFBF00]">
              Nights Begin
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#A0A0A0] font-sans mb-10 max-w-2xl mx-auto">
            Rare bottles. Premium taste. Elevate every celebration with luxury spirits delivered fast.
          </p>

          {/* High-Converting CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            
            <button className="px-10 py-4 bg-[#D4AF37] hover:bg-[#FFBF00] text-[#0C0C0C] font-bold rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(255,191,0,0.5)] transform hover:-translate-y-1">
              Secure Your Bottle
            </button>

            <button className="px-10 py-4 bg-transparent border border-white/20 text-white hover:border-[#D4AF37] hover:text-[#D4AF37] hover:bg-white/5 font-semibold rounded-full transition-all duration-300">
              Explore Collections
            </button>

          </div>

          {/* VIP Access Link */}
          <div className="mt-8 text-center">
            <a href="/dashboard" className="text-[#D4AF37] text-xs uppercase tracking-widest hover:text-[#FFBF00] transition-colors border-b border-transparent hover:border-[#D4AF37]">
              Black Card Members →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}