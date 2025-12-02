"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, CheckSquare, Zap, Shield, Layout } from "lucide-react";

export default function HomePage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#31364F] via-[#435663] to-[#31364F] relative overflow-hidden">
      {/* Animated background orbs */}
      <div
        className="absolute w-96 h-96 bg-[#A3B087] rounded-full blur-3xl opacity-20 transition-all duration-1000 ease-out"
        style={{
          left: `${mousePos.x * 0.02}px`,
          top: `${mousePos.y * 0.02}px`,
        }}
      />
      <div
        className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-[#FFF8D4] rounded-full blur-3xl opacity-10 transition-all duration-1000 ease-out"
        style={{
          right: `${-mousePos.x * 0.01}px`,
          bottom: `${-mousePos.y * 0.01}px`,
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(163,176,135,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(163,176,135,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex justify-between items-center">
          <div
            className={`flex items-center gap-2 transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <CheckSquare
              className="text-[#A3B087]"
              size={32}
              strokeWidth={2.5}
            />
            <span className="text-2xl font-bold text-[#FFF8D4] tracking-tight">
              SystemFlow
            </span>
          </div>
          <div
            className={`flex gap-4 transition-all duration-700 delay-100 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <a
              href="/auth/sign-in"
              className="px-5 py-2 text-[#FFF8D4] hover:text-white transition-colors font-medium"
            >
              Sign In
            </a>
            <a
              href="/auth/sign-up"
              className="px-5 py-2 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              Sign Up
            </a>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-6xl md:text-7xl font-bold text-[#FFF8D4] mb-6 leading-tight">
                Organize Your World,
                <br />
                <span className="text-[#A3B087]">One System at a Time</span>
              </h1>
              <p className="text-xl text-[#FFF8D4]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                Create powerful todo systems tailored to your workflow. Start
                with a curated default system or build your own from scratch.
                Full CRUD control at your fingertips.
              </p>
            </div>

            {/* Feature Cards */}
            <div
              className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-1000 delay-200 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-[#435663]/30 backdrop-blur-sm p-6 rounded-xl border border-[#A3B087]/20 hover:border-[#A3B087]/50 transition-all hover:transform hover:scale-105">
                <Zap className="text-[#A3B087] mb-3 mx-auto" size={32} />
                <h3 className="text-[#FFF8D4] font-semibold mb-2">
                  Instant Start
                </h3>
                <p className="text-[#FFF8D4]/70 text-sm">
                  Get a pre-configured system with sample todos to jumpstart
                  your productivity
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
                <h3 className="text-[#FFF8D4] font-semibold mb-2">
                  Full Control
                </h3>
                <p className="text-[#FFF8D4]/70 text-sm">
                  Complete CRUD operations on all your systems and todos with
                  ease
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <a
                href="/system"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#A3B087] to-[#b5c59a] text-[#31364F] rounded-xl hover:shadow-2xl transition-all font-bold text-lg hover:scale-110 group"
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
        </main>

        {/* Footer */}
        <footer className="p-6 text-center text-[#FFF8D4]/50 text-sm">
          <p>© 2024 SystemFlow. Built for productivity enthusiasts.</p>
        </footer>
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#A3B087] rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
}
