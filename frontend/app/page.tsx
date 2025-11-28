"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // Fetch todos from your backend
  const fetchTodos = () => {
    setLoading(true);
    fetch("http://localhost:8081/api/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Create
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await fetch("http://localhost:8081/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, title: newTitle, completed: false }),
    });
    setNewTitle("");
    fetchTodos();
  };

  // Update (toggle completed)
  const toggleTodo = async (todo: Todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
    setEditCompleted(todo.completed);
  };

  // Save edit
  const saveEdit = async () => {
    if (!editTodo) return;
    await fetch(`http://localhost:8081/api/todos/${editTodo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, completed: editCompleted }),
    });
    setEditTodo(null);
    fetchTodos();
  };

  // Delete
  const deleteTodo = async (id: number) => {
    await fetch(`http://localhost:8081/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="text-lg text-gray-500">Laddar...</span>
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto py-12 px-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
        Mina Todos <span className="text-blue-500">(Rust-backend)</span>
      </h1>
      <form
        onSubmit={addTodo}
        className="flex gap-3 mb-8 bg-white rounded-xl shadow p-4"
      >
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Ny todo..."
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
          type="submit"
        >
          Lägg till
        </button>
      </form>
      <ul className="space-y-5">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-5 rounded-2xl shadow-lg border transition group cursor-pointer
              ${
                todo.completed
                  ? "bg-green-50 border-green-200 hover:border-green-400"
                  : "bg-yellow-50 border-yellow-200 hover:border-yellow-400"
              }
            `}
            onClick={() => toggleTodo(todo)}
            title="Klicka för att redigera"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-gray-400">
                #{todo.id}
              </span>
              <span
                className={`font-medium text-lg transition ${
                  todo.completed
                    ? "line-through text-green-700"
                    : "text-yellow-700 group-hover:text-yellow-900"
                }`}
              >
                {todo.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                  todo.completed
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}
              >
                {todo.completed ? "Klar" : "Ej klar"}
              </span>
              <button
                className="ml-2 text-red-400 hover:text-red-600 text-lg px-2 py-1 rounded transition"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id);
                }}
                title="Ta bort"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for editing */}
      {editTodo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setEditTodo(null)}
              title="Stäng"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Redigera Todo
            </h2>
            <div className="mb-4">
              <label className="block text-gray-600 mb-1">Titel</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                checked={editCompleted}
                onChange={(e) => setEditCompleted(e.target.checked)}
                id="edit-completed"
                className="accent-blue-500 w-5 h-5"
              />
              <label htmlFor="edit-completed" className="text-gray-700">
                Klar
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                onClick={() => setEditTodo(null)}
              >
                Avbryt
              </button>
              <button
                className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                onClick={saveEdit}
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
