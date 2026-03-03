"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const defaultTasks = [
  { id: 1, text: "Morning code session", completed: false },
  { id: 2, text: "Review PRs", completed: false },
  { id: 3, text: "Write documentation", completed: false },
  { id: 4, text: "Run tests", completed: false },
  { id: 5, text: "Deploy to staging", completed: false },
];

export default function DevChecklist() {
  const [tasks, setTasks] = useState(defaultTasks);
  const [newTask, setNewTask] = useState("");

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
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

        {/* Add Task */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition"
          />
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Add
          </button>
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
              
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-600 hover:text-red-500 transition"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 py-8">No tasks yet. Add one above!</p>
        )}
      </div>
    </main>
  );
}
