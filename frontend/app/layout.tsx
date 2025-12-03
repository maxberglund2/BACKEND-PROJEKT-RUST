"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { CheckSquare, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsVisible(true);

    // Check if user is logged in by checking for token
    const checkAuth = () => {
      const token = localStorage.getItem("user");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage changes (logout in another tab)
    window.addEventListener("storage", checkAuth);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]); // Re-check auth on route change

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <div className="min-h-screen bg-linear-to-br from-[#31364F] via-[#435663] to-[#31364F] relative overflow-hidden">
          {/* ...existing code... */}
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

          <div className="absolute inset-0 bg-[linear-gradient(rgba(163,176,135,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(163,176,135,0.05)_1px,transparent_1px)] bg-size-[50px_50px]" />

          <div className="relative z-10 min-h-screen flex flex-col">
            <header className="p-6 flex justify-between items-center">
              <Link
                href="/"
                className={`flex items-center gap-2 transition-all duration-700 cursor-pointer hover:opacity-80 ${
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
              </Link>
              <div
                className={`flex gap-4 transition-all duration-700 delay-100 ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-10 opacity-0"
                }`}
              >
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="px-5 py-2 text-[#FFF8D4] hover:text-white transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="px-5 py-2 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <footer className="p-6 text-center text-[#FFF8D4]/50 text-sm">
              <p>© 2025 SystemFlow. Built for productivity enthusiasts.</p>
            </footer>
          </div>

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
      </body>
    </html>
  );
}
