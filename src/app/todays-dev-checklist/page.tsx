"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "dev-checklist-tasks";
const RAW_GITHUB_URL = "https://raw.githubusercontent.com/DixieIT/gabriele-masiero-portfolio/main/src/app/todays-dev-checklist/tasks.json?t=" + Date.now();

const defaultTasks = [
  { id: 1, text: "Chips su features", completed: false },
  { id: 2, text: "Chips verticali su path", completed: false },
  { id: 3, text: "Polishing storage UI", completed: false },
  { id: 4, text: "Skills per bibibot", completed: false },
];

async function loadTasks() {
  // Try GitHub first
  try {
    const res = await fetch(RAW_GITHUB_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {}
  
  // Fallback to localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  
  return defaultTasks;
}

export default function DevChecklist() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadTasks().then((data) => {
      setTasks(data);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, loaded]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Today's Dev Checklist
        </motion.h1>
        
        <p className="text-gray-400 mb-8">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedCount}/{tasks.length}</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-4 p-4 rounded-lg border transition ${
                task.completed 
                  ? "bg-gray-900/50 border-gray-700" 
                  : "bg-gray-900 border-gray-800 hover:border-cyan-500/50"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                  task.completed 
                    ? "bg-cyan-500 border-cyan-500" 
                    : "border-gray-600 hover:border-cyan-500"
                }`}
              >
                {task.completed && <span className="text-black text-sm">✓</span>}
              </button>
              
              <span className={`flex-1 ${task.completed ? "text-gray-500 line-through" : "text-white"}`}>
                {task.text}
              </span>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks yet. Message nanobot to add tasks!</p>
        )}
      </div>
    </main>
  );
}
