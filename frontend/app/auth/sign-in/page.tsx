"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already signed in
    const user = localStorage.getItem("user");
    if (user) {
      router.push("/system");
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8081/api/auth/signin", {
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
        setError(errorText || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-6 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <div className="bg-[#435663]/30 backdrop-blur-sm p-8 rounded-2xl border border-[#A3B087]/20 shadow-2xl">
          <h2 className="text-3xl font-bold text-[#FFF8D4] mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-[#FFF8D4]/70 text-center mb-8">
            Sign in to continue your journey
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#A3B087] to-[#b5c59a] text-[#31364F] rounded-lg hover:shadow-xl transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? "Signing In..." : "Sign In"}
              {!isLoading && (
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              )}
            </button>
          </form>

          <p className="text-center text-[#FFF8D4]/60 text-sm mt-6">
            Don't have an account?{" "}
            <a
              href="/auth/sign-up"
              className="text-[#A3B087] hover:text-[#b5c59a] font-semibold"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
