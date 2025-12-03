"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface System {
  id: number;
  name: string;
  user_id: number;
  is_default: boolean;
}

export default function SystemsPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [systems, setSystems] = useState<System[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    user_id: null as number | null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          const id = Number(parsedUser.id);
          setUserId(id);
          setFormData((prev) => ({ ...prev, user_id: id }));
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
      }
    }
  }, []);
  
  useEffect(() => {
    // Check if user is signed in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }
  }, []);

  useEffect(() => {
    setIsVisible(true);
    if (userId !== null) {
      fetchSystems();
    }
  }, [userId]);

  const fetchSystems = async () => {
    if (userId === null) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/systems/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSystems(data);
      }
    } catch (error) {
      console.error("Failed to fetch systems:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.user_id === null) {
      alert("User ID not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8081/api/systems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          user_id: formData.user_id,
          is_default: false, // Always false for user-created systems
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: "", user_id: userId });
        fetchSystems();
      }
    } catch (error) {
      console.error("Failed to create system:", error);
    }
  };

  const handleDelete = async (id: number, isDefault: boolean) => {
    if (isDefault) {
      alert("Cannot delete the default system!");
      return;
    }

    if (!confirm("Are you sure you want to delete this system?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8081/api/systems/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSystems();
      }
    } catch (error) {
      console.error("Failed to delete system:", error);
    }
  };

  return (
    <div className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-[#FFF8D4] mb-4">
            Your <span className="text-[#A3B087]">Systems</span>
          </h1>
          <p className="text-lg text-[#FFF8D4]/80">
            Manage your productivity systems
          </p>
        </div>

        {/* Systems Grid */}
        <div
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Add New System Card */}
          <div
            onClick={() => setShowModal(true)}
            className="bg-[#435663]/30 backdrop-blur-sm p-8 rounded-xl border-2 border-dashed border-[#A3B087]/40 hover:border-[#A3B087] transition-all cursor-pointer hover:scale-105 flex flex-col items-center justify-center min-h-[200px] group"
          >
            <Plus
              className="text-[#A3B087] mb-3 group-hover:scale-110 transition-transform"
              size={48}
              strokeWidth={2}
            />
            <h3 className="text-[#FFF8D4] font-semibold text-lg">
              Create New System
            </h3>
          </div>

          {/* Existing Systems */}
          {systems.map((system) => (
            <div
              key={system.id}
              className="bg-[#435663]/30 backdrop-blur-sm p-6 rounded-xl border border-[#A3B087]/20 hover:border-[#A3B087]/50 transition-all hover:scale-105 flex flex-col min-h-[200px] group relative"
            >
              {system.is_default && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-[#A3B087]/20 text-[#A3B087] text-xs font-semibold rounded-full">
                  Default
                </span>
              )}

              <div className="flex-1">
                <h3 className="text-[#FFF8D4] font-bold text-xl mb-2 mt-2">
                  {system.name}
                </h3>
                <p className="text-[#FFF8D4]/70 text-sm">
                  System ID: {system.id}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/system/${system.id}`)}
                  className="flex-1 px-4 py-2 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold"
                >
                  View System
                </button>
                {!system.is_default && (
                  <button
                    onClick={() => handleDelete(system.id, system.is_default)}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#435663] rounded-2xl p-8 max-w-md w-full border border-[#A3B087]/30 relative animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#FFF8D4]/60 hover:text-[#FFF8D4] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold text-[#FFF8D4] mb-6">
              Create New System
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#FFF8D4] font-semibold mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#31364F] text-[#FFF8D4] rounded-lg border border-[#A3B087]/20 focus:border-[#A3B087] focus:outline-none transition-colors"
                  placeholder="Enter system name..."
                  required
                />
              </div>

              <div className="bg-[#31364F]/50 p-4 rounded-lg border border-[#A3B087]/10">
                <p className="text-[#FFF8D4]/70 text-sm">
                  💡 <strong className="text-[#A3B087]">Note:</strong> Your
                  default system was created automatically when you signed up.
                  New systems you create will be regular systems.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 bg-[#31364F] text-[#FFF8D4] rounded-lg hover:bg-[#31364F]/80 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  Create System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
