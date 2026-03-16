"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const defaultTasks: Task[] = [];

export default function DevChecklist() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [loaded, setLoaded] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [deletingCommentKey, setDeletingCommentKey] = useState<string | null>(null);
  const toggleTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const latestToggleStateRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    const toggleTimers = toggleTimersRef.current;
    const latestToggleState = latestToggleStateRef.current;

    return () => {
      toggleTimers.forEach((timer) => clearTimeout(timer));
      toggleTimers.clear();
      latestToggleState.clear();
    };
  }, []);

  const scheduleToggleSync = (id: string, completed: boolean) => {
    latestToggleStateRef.current.set(id, completed);

    const existingTimer = toggleTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const nextTimer = setTimeout(() => {
      const latestCompleted = latestToggleStateRef.current.get(id);
      if (latestCompleted === undefined) {
        return;
      }

      fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: latestCompleted }),
        keepalive: true
      }).catch(() => {
        // Intentionally no rollback: checklist is optimistic by design.
      });

      toggleTimersRef.current.delete(id);
    }, 180);

    toggleTimersRef.current.set(id, nextTimer);
  };

  const addTask = async () => {
    if (!newTaskText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const text = newTaskText.trim();
    
    // Check if input contains semicolon for batch upload
    const isBatch = text.includes(';');
    const method = isBatch ? "PATCH" : "POST";
    const body = isBatch ? JSON.stringify({ text }) : JSON.stringify({ text });
    
    const res = await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body
    });
    
    if (res.ok) {
      const result = await res.json();
      // Handle both single task (newTask) and batch ({ created: [...] })
      const newTasks = isBatch ? result.created : [result];
      setTasks(prev => [...prev, ...newTasks]);
      setNewTaskText("");
      setIsAddingTask(false);
    }
    setIsSubmitting(false);
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: nextCompleted } : t));
    scheduleToggleSync(id, nextCompleted);
  };

  const addComment = async (taskId: string) => {
    const text = newComment[taskId];
    if (!text?.trim() || submittingComment === taskId) return;

    setSubmittingComment(taskId);
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
    setSubmittingComment(null);
  };

  const deleteTask = async (id: string) => {
    if (deletingTaskId === id) return;

    const existingTimer = toggleTimersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      toggleTimersRef.current.delete(id);
      latestToggleStateRef.current.delete(id);
    }

    setDeletingTaskId(id);
    const res = await fetch(`${API_URL}?id=${encodeURIComponent(id)}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setTasks(prev => prev.filter(task => task.id !== id));
      if (expandedTask === id) {
        setExpandedTask(null);
      }
    }
    setDeletingTaskId(null);
  };

  const deleteComment = async (taskId: string, commentId: string) => {
    const deletingKey = `${taskId}:${commentId}`;
    if (deletingCommentKey === deletingKey) return;

    setDeletingCommentKey(deletingKey);
    const res = await fetch(
      `${API_URL}?taskId=${encodeURIComponent(taskId)}&commentId=${encodeURIComponent(commentId)}`,
      { method: "DELETE" }
    );

    if (res.ok) {
      setTasks(prev => prev.map(task => {
        if (task.id !== taskId) {
          return task;
        }

        return {
          ...task,
          comments: (task.comments || []).filter(comment => comment.id !== commentId)
        };
      }));
    }
    setDeletingCommentKey(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (!loaded) {
    return (
      <main className="min-h-screen bg-black text-white px-4 py-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Today&apos;s Dev Checklist
          </motion.h1>

          <p className="text-gray-400 mb-8">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          <div className="flex items-center justify-center py-12 sm:py-16">
            <div className="flex items-center gap-3 text-gray-300">
              <motion.span
                className="block h-2 w-2 rounded-full bg-cyan-400"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="block h-2 w-2 rounded-full bg-cyan-400"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="block h-2 w-2 rounded-full bg-cyan-400"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
              <span className="text-xs sm:text-sm tracking-wide">Loading checklist</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Today&apos;s Dev Checklist
        </motion.h1>
        
        <p className="text-gray-400 mb-8">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>

        <div className="mb-6 sm:mb-8">
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
          {tasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-lg border transition-colors duration-200 ${
                  task.completed 
                    ? "bg-gray-900/50 border-gray-700" 
                    : "bg-gray-900 border-gray-800 hover:border-cyan-500/50"
                }`}
              >
                <div className="flex items-start gap-3 p-3 sm:p-4">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-7 h-7 sm:w-6 sm:h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition shrink-0 ${
                      task.completed 
                        ? "bg-cyan-500 border-cyan-500" 
                        : "border-gray-600 hover:border-cyan-500"
                    }`}
                  >
                    {task.completed && <span className="text-black text-sm">✓</span>}
                  </button>

                  <div className="flex-1 min-w-0 flex items-start gap-2">
                    <span 
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className={`flex-1 min-w-0 cursor-pointer break-words select-none ${task.completed ? "text-gray-500 line-through" : "text-white"}`}
                    >
                      {task.text}
                    </span>

                    <div className="flex items-center gap-2 flex-nowrap shrink-0">
                      {(task.comments?.length ?? 0) > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full whitespace-nowrap shrink-0">
                          {task.comments?.length} comment{(task.comments?.length ?? 0) !== 1 ? 's' : ''}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteTask(task.id);
                        }}
                        disabled={deletingTaskId === task.id}
                        className="text-gray-500 hover:text-red-400 text-sm px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                        aria-label="Delete task"
                        title="Delete task"
                      >
                        x
                      </button>
                    </div>
                  </div>
                </div>

                {expandedTask === task.id && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-800">
                      <div className="mt-4 space-y-3">
                        {task.comments?.map(comment => (
                          <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3 text-sm">
                            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
                              <span>{new Date(comment.createdAt).toLocaleString()}</span>
                              <button
                                type="button"
                                onClick={() => deleteComment(task.id, comment.id)}
                                disabled={deletingCommentKey === `${task.id}:${comment.id}`}
                                className="text-gray-500 hover:text-red-400 px-2 py-1 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Delete comment"
                                title="Delete comment"
                              >
                                x
                              </button>
                            </div>
                            <div className="text-sm leading-6 text-gray-200 break-words">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.text}</ReactMarkdown>
                            </div>
                          </div>
                        ))}

                        <div className="flex flex-col sm:flex-row gap-2">
                          <textarea
                            value={newComment[task.id] || ""}
                            onChange={e => setNewComment(prev => ({ ...prev, [task.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === "Enter" && e.ctrlKey && submittingComment !== task.id) {
                                e.preventDefault();
                                addComment(task.id);
                              }
                            }}
                            placeholder="Add a comment (markdown supported, Ctrl+Enter to send)..."
                            disabled={submittingComment === task.id}
                            rows={2}
                            className="w-full sm:flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none disabled:opacity-50"
                          />
                          <button
                            onClick={() => addComment(task.id)}
                            disabled={submittingComment === task.id}
                            className="w-full sm:w-auto px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add
                          </button>
                        </div>

                        {(newComment[task.id] || "").trim().length > 0 && (
                          <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-3">
                            <p className="text-xs text-gray-400 mb-2">Preview</p>
                            <div className="text-sm leading-6 text-gray-200 break-words">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {newComment[task.id]}
                              </ReactMarkdown>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ))}
        </div>

        {isAddingTask ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={newTaskText}
              onChange={e => setNewTaskText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !isSubmitting && addTask()}
              placeholder="What needs to be done?"
              disabled={isSubmitting}
              autoFocus
              className="w-full sm:flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
            />
            <button
              onClick={addTask}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
            <button
              onClick={() => { setIsAddingTask(false); setNewTaskText(""); }}
              className="w-full sm:w-auto px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
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
