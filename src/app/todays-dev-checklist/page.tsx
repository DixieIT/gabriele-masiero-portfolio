"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Comment = {
  id: string;
  text: string;
  createdAt: number;
};

type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  comments: Comment[];
};

const API_URL = "/api/tasks";

const defaultTasks: Task[] = [
  { id: "1", text: "Welcome to your new checklist!", completed: false, createdAt: Date.now(), comments: [] },
];

export default function DevChecklist() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [loaded, setLoaded] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [isAddingTask, setIsAddingTask] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTasks(data);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const addTask = async () => {
    if (!newTaskText.trim()) return;
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newTaskText.trim() })
    });
    
    if (res.ok) {
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
      setNewTaskText("");
      setIsAddingTask(false);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !task.completed })
    });

    if (res.ok) {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const addComment = async (taskId: string) => {
    const text = newComment[taskId];
    if (!text?.trim()) return;

    const res = await fetch(API_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, commentText: text.trim() })
    });

    if (res.ok) {
      const comment = await res.json();
      setTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          return { ...t, comments: [...(t.comments || []), comment] };
        }
        return t;
      }));
      setNewComment(prev => ({ ...prev, [taskId]: "" }));
    }
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

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`rounded-lg border transition ${
                  task.completed 
                    ? "bg-gray-900/50 border-gray-700" 
                    : "bg-gray-900 border-gray-800 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-center gap-4 p-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                      task.completed 
                        ? "bg-cyan-500 border-cyan-500" 
                        : "border-gray-600 hover:border-cyan-500"
                    }`}
                  >
                    {task.completed && <span className="text-black text-sm">✓</span>}
                  </button>
                  
                  <span 
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className={`flex-1 cursor-pointer ${task.completed ? "text-gray-500 line-through" : "text-white"}`}
                  >
                    {task.text}
                  </span>

                  {(task.comments?.length ?? 0) > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                      {task.comments?.length} comment{(task.comments?.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {expandedTask === task.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-0 border-t border-gray-800"
                    >
                      <div className="mt-4 space-y-3">
                        {task.comments?.map(comment => (
                          <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3 text-sm">
                            <div className="text-gray-400 text-xs mb-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown>{comment.text}</ReactMarkdown>
                            </div>
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <textarea
                            value={newComment[task.id] || ""}
                            onChange={e => setNewComment(prev => ({ ...prev, [task.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === "Enter" && e.ctrlKey) {
                                e.preventDefault();
                                addComment(task.id);
                              }
                            }}
                            placeholder="Add a comment (markdown supported, Ctrl+Enter to send)..."
                            rows={2}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                          />
                          <button
                            onClick={() => addComment(task.id)}
                            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {isAddingTask ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="What needs to be done?"
              autoFocus
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={addTask}
              className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition"
            >
              Add
            </button>
            <button
              onClick={() => { setIsAddingTask(false); setNewTaskText(""); }}
              className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsAddingTask(true)}
            className="w-full py-3 border-2 border-dashed border-gray-700 hover:border-cyan-500 text-gray-400 hover:text-cyan-400 rounded-lg transition"
          >
            + Add Task
          </button>
        )}

        {tasks.length === 0 && loaded && (
          <p className="text-center text-gray-500 py-8">No tasks yet. Click above to add one!</p>
        )}
      </div>
    </main>
  );
}
