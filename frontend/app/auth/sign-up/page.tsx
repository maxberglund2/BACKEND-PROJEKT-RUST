"use client";

import React, { useState, useEffect } from "react";
import { CheckSquare, Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8081/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/system");
      } else {
        const errorText = await response.text();
        setError(errorText || "Failed to create account");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <CheckSquare className="text-[#A3B087]" size={32} strokeWidth={2.5} />
            <span className="text-2xl font-bold text-[#FFF8D4] tracking-tight">
              SystemFlow
            </span>
          </a>
          <div className="flex gap-4">
            <a
              href="/auth/sign-in"
              className="px-5 py-2 text-[#FFF8D4] hover:text-white transition-colors font-medium"
            >
              Sign In
            </a>
          </div>
        </header>

        {/* Sign Up Form */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-[#435663]/30 backdrop-blur-sm p-8 rounded-2xl border border-[#A3B087]/20 shadow-2xl">
              <h2 className="text-3xl font-bold text-[#FFF8D4] mb-2 text-center">
                Create Account
              </h2>
              <p className="text-[#FFF8D4]/70 text-center mb-8">
                Start organizing your world today
              </p>

              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignUp} className="space-y-6">
                <div>
                  <label className="block text-[#FFF8D4] text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3B087]"
                      size={20}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#31364F]/50 border border-[#A3B087]/30 rounded-lg text-[#FFF8D4] placeholder-[#FFF8D4]/40 focus:outline-none focus:border-[#A3B087] transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#FFF8D4] text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3B087]"
                      size={20}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#31364F]/50 border border-[#A3B087]/30 rounded-lg text-[#FFF8D4] placeholder-[#FFF8D4]/40 focus:outline-none focus:border-[#A3B087] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#FFF8D4] text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3B087]"
                      size={20}
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-[#31364F]/50 border border-[#A3B087]/30 rounded-lg text-[#FFF8D4] placeholder-[#FFF8D4]/40 focus:outline-none focus:border-[#A3B087] transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#A3B087] to-[#b5c59a] text-[#31364F] rounded-lg hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                  {!isLoading && (
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  )}
                </button>
              </form>

              <p className="text-center text-[#FFF8D4]/60 text-sm mt-6">
                Already have an account?{" "}
                <a href="/auth/sign-in" className="text-[#A3B087] hover:text-[#b5c59a] font-semibold">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}