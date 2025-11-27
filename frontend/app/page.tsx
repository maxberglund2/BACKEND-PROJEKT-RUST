"use client";

import { useEffect, useState } from "react";

type Todo = {
  user_id: number;
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.slice(0, 10));
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-gray-500">Laddar...</span>
      </div>
    );

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Todos från Rust-backend
      </h1>
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow transition
              ${
                todo.completed
                  ? "bg-green-50 border-l-4 border-green-400"
                  : "bg-yellow-50 border-l-4 border-yellow-400"
              }
            `}
          >
            <div>
              <span className="font-mono text-xs text-gray-400 mr-2">
                #{todo.id}
              </span>
              <span
                className={`font-medium ${
                  todo.completed
                    ? "line-through text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {todo.title}
              </span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold
                ${
                  todo.completed
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }
              `}
            >
              {todo.completed ? "Klar" : "Ej klar"}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
