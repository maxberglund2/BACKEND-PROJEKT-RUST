"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Zap, Shield, Layout } from "lucide-react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex items-center justify-center px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-6xl md:text-7xl font-bold text-[#FFF8D4] mb-6 leading-tight">
            Organize Your World,
            <br />
            <span className="text-[#A3B087]">One System at a Time</span>
          </h1>
          <p className="text-xl text-[#FFF8D4]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Create powerful todo systems tailored to your workflow. Start with a
            curated default system or build your own from scratch. Full CRUD
            control at your fingertips.
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-[#435663]/30 backdrop-blur-sm p-6 rounded-xl border border-[#A3B087]/20 hover:border-[#A3B087]/50 transition-all hover:transform hover:scale-105">
            <Zap className="text-[#A3B087] mb-3 mx-auto" size={32} />
            <h3 className="text-[#FFF8D4] font-semibold mb-2">Instant Start</h3>
            <p className="text-[#FFF8D4]/70 text-sm">
              Get a pre-configured system with sample todos to jumpstart your
              productivity
            </p>
          </div>
          <div className="bg-[#435663]/30 backdrop-blur-sm p-6 rounded-xl border border-[#A3B087]/20 hover:border-[#A3B087]/50 transition-all hover:transform hover:scale-105">
            <Layout className="text-[#A3B087] mb-3 mx-auto" size={32} />
            <h3 className="text-[#FFF8D4] font-semibold mb-2">
              Custom Systems
            </h3>
            <p className="text-[#FFF8D4]/70 text-sm">
              Design your own systems with unlimited todos tailored to your
              unique needs
            </p>
          </div>
          <div className="bg-[#435663]/30 backdrop-blur-sm p-6 rounded-xl border border-[#A3B087]/20 hover:border-[#A3B087]/50 transition-all hover:transform hover:scale-105">
            <Shield className="text-[#A3B087] mb-3 mx-auto" size={32} />
            <h3 className="text-[#FFF8D4] font-semibold mb-2">Full Control</h3>
            <p className="text-[#FFF8D4]/70 text-sm">
              Complete CRUD operations on all your systems and todos with ease
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <a
            href="/system"
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-[#A3B087] to-[#b5c59a] text-[#31364F] rounded-xl hover:shadow-2xl transition-all font-bold text-lg hover:scale-110 group"
          >
            Enter Your System
            <ChevronRight
              className="group-hover:translate-x-1 transition-transform"
              size={24}
            />
          </a>
          <p className="text-[#FFF8D4]/60 text-sm mt-4">
            No credit card required • Free to start
          </p>
        </div>
      </div>
    </div>
  );
}
