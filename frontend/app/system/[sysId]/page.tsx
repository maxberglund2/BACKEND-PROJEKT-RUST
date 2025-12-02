"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Trash2,
  Edit2,
  Check,
  Square,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface Todo {
  id: number;
  user_id: number;
  system_id: number;
  title: string;
  completed: boolean;
}

interface System {
  id: number;
  name: string;
  user_id: number;
  is_default: boolean;
}

export default function SystemDetailPage() {
  const router = useRouter();
  const params = useParams();
  const systemId = params.sysId as string;

  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [system, setSystem] = useState<System | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    completed: false,
  });

  useEffect(() => {
    // Check if user is signed in
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    setIsVisible(true);
    fetchSystem();
    fetchTodos();
  }, []);

  const fetchSystem = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8081/api/systems/1"); // TODO: Replace with actual user ID
      if (response.ok) {
        const data = await response.json();
        const currentSystem = data.find(
          (s: System) => s.id === parseInt(systemId)
        );
        setSystem(currentSystem || null);
      }
    } catch (error) {
      console.error("Failed to fetch system:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/systems/${systemId}/todos`
      );
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        console.log("Editing todo:", editingTodo);
        console.log("Form data:", formData);
        // Update existing todo
        const response = await fetch(
          `http://127.0.0.1:8081/api/todos/${editingTodo.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: formData.title,
              completed: formData.completed,
            }),
          }
        );

        if (response.ok) {
          setShowModal(false);
          setEditingTodo(null);
          setFormData({ title: "", completed: false });
          fetchTodos();
        }
      } else {
        // Create new todo
        const response = await fetch("http://127.0.0.1:8081/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            system_id: parseInt(systemId),
            title: formData.title,
            completed: formData.completed,
          }),
        });

        if (response.ok) {
          setShowModal(false);
          setFormData({ title: "", completed: false });
          fetchTodos();
        }
      }
    } catch (error) {
      console.error("Failed to save todo:", error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/api/todos/${todo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            completed: !todo.completed,
          }),
        }
      );

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      completed: todo.completed,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8081/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    setFormData({ title: "", completed: false });
  };

  const completedTodos = todos.filter((t) => t.completed);
  const incompleteTodos = todos.filter((t) => !t.completed);

  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`mb-8 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <button
            onClick={() => router.push("/system")}
            className="flex items-center gap-2 text-[#A3B087] hover:text-[#b5c59a] transition-colors mb-4 group"
          >
            <ArrowLeft
              className="group-hover:-translate-x-1 transition-transform"
              size={20}
            />
            Back to Systems
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-[#FFF8D4] mb-2">
                {system?.name || "Loading..."}
              </h1>
              {system?.is_default && (
                <span className="inline-block px-3 py-1 bg-[#A3B087]/20 text-[#A3B087] text-sm font-semibold rounded-full">
                  Default System
                </span>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Plus size={20} strokeWidth={2.5} />
              Add Todo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-3 gap-4 mb-8 transition-all duration-1000 delay-100 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-[#435663]/30 backdrop-blur-sm p-4 rounded-xl border border-[#A3B087]/20">
            <p className="text-[#FFF8D4]/70 text-sm mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-[#FFF8D4]">{todos.length}</p>
          </div>
          <div className="bg-[#435663]/30 backdrop-blur-sm p-4 rounded-xl border border-[#A3B087]/20">
            <p className="text-[#FFF8D4]/70 text-sm mb-1">Completed</p>
            <p className="text-3xl font-bold text-[#A3B087]">
              {completedTodos.length}
            </p>
          </div>
          <div className="bg-[#435663]/30 backdrop-blur-sm p-4 rounded-xl border border-[#A3B087]/20">
            <p className="text-[#FFF8D4]/70 text-sm mb-1">Remaining</p>
            <p className="text-3xl font-bold text-[#FFF8D4]">
              {incompleteTodos.length}
            </p>
          </div>
        </div>

        {/* Todos List */}
        <div
          className={`space-y-6 transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {/* Incomplete Todos */}
          {incompleteTodos.length > 0 && (
            <div className="bg-[#435663]/30 backdrop-blur-sm rounded-xl border border-[#A3B087]/20 p-6">
              <h2 className="text-2xl font-bold text-[#FFF8D4] mb-4 flex items-center gap-2">
                <Square className="text-[#A3B087]" size={24} />
                To Do ({incompleteTodos.length})
              </h2>
              <div className="space-y-3">
                {incompleteTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-[#31364F]/50 p-4 rounded-lg border border-[#A3B087]/10 hover:border-[#A3B087]/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className="shrink-0 w-6 h-6 rounded border-2 border-[#A3B087]/50 hover:border-[#A3B087] hover:bg-[#A3B087]/10 transition-all"
                      />
                      <span className="flex-1 text-[#FFF8D4] font-medium">
                        {todo.title}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 bg-[#A3B087]/20 text-[#A3B087] rounded hover:bg-[#A3B087]/30 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div className="bg-[#435663]/30 backdrop-blur-sm rounded-xl border border-[#A3B087]/20 p-6">
              <h2 className="text-2xl font-bold text-[#FFF8D4] mb-4 flex items-center gap-2">
                <CheckSquare className="text-[#A3B087]" size={24} />
                Completed ({completedTodos.length})
              </h2>
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-[#31364F]/50 p-4 rounded-lg border border-[#A3B087]/10 hover:border-[#A3B087]/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleComplete(todo)}
                        className="shrink-0 w-6 h-6 rounded border-2 border-[#A3B087] bg-[#A3B087] hover:bg-[#A3B087]/80 transition-all flex items-center justify-center"
                      >
                        <Check size={16} className="text-[#31364F]" />
                      </button>
                      <span className="flex-1 text-[#FFF8D4]/60 font-medium line-through">
                        {todo.title}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 bg-[#A3B087]/20 text-[#A3B087] rounded hover:bg-[#A3B087]/30 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="p-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {todos.length === 0 && (
            <div className="bg-[#435663]/30 backdrop-blur-sm rounded-xl border border-[#A3B087]/20 p-12 text-center">
              <CheckSquare
                className="text-[#A3B087] mx-auto mb-4 opacity-50"
                size={64}
              />
              <h3 className="text-2xl font-bold text-[#FFF8D4] mb-2">
                No todos yet
              </h3>
              <p className="text-[#FFF8D4]/70 mb-6">
                Start organizing your tasks by adding your first todo
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold"
              >
                <Plus size={20} />
                Add Your First Todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#435663] rounded-2xl p-8 max-w-md w-full border border-[#A3B087]/30 relative animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-[#FFF8D4]/60 hover:text-[#FFF8D4] transition-colors"
            >
              <X size={24} />
            </button>

            <h2 className="text-3xl font-bold text-[#FFF8D4] mb-6">
              {editingTodo ? "Edit Todo" : "Add New Todo"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#FFF8D4] font-semibold mb-2">
                  Todo Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#31364F] text-[#FFF8D4] rounded-lg border border-[#A3B087]/20 focus:border-[#A3B087] focus:outline-none transition-colors"
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="completed"
                  checked={formData.completed}
                  onChange={(e) =>
                    setFormData({ ...formData, completed: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-2 border-[#A3B087]/50 bg-[#31364F] checked:bg-[#A3B087] checked:border-[#A3B087] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="completed"
                  className="text-[#FFF8D4] font-medium cursor-pointer"
                >
                  Mark as completed
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-[#31364F] text-[#FFF8D4] rounded-lg hover:bg-[#31364F]/80 transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#A3B087] text-[#31364F] rounded-lg hover:bg-[#b5c59a] transition-all font-semibold shadow-lg hover:shadow-xl"
                >
                  {editingTodo ? "Update" : "Add"} Todo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
