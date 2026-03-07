import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

let redis: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redis.connect();
  }
  return redis;
}

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  text: string;
  createdAt: number;
};

const TASKS_KEY = 'dev-checklist-tasks';

async function getTasks(): Promise<Task[]> {
  const client = await getRedisClient();
  const data = await client.get(TASKS_KEY);
  return data ? JSON.parse(data) : [];
}

async function setTasks(tasks: Task[]): Promise<void> {
  const client = await getRedisClient();
  await client.set(TASKS_KEY, JSON.stringify(tasks));
}

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks || []);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const tasks = await getTasks();
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      comments: []
    };

    tasks.push(newTask);
    await setTasks(tasks);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, text, completed } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const tasks = await getTasks();
    const taskIndex = tasks.findIndex((t: Task) => t.id === id);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (text !== undefined) tasks[taskIndex].text = text;
    if (completed !== undefined) tasks[taskIndex].completed = completed;

    await setTasks(tasks);
    return NextResponse.json(tasks[taskIndex]);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, commentText } = body;

    if (!taskId || !commentText) {
      return NextResponse.json({ error: 'taskId and commentText are required' }, { status: 400 });
    }

    const tasks = await getTasks();
    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      text: commentText.trim(),
      createdAt: Date.now()
    };

    tasks[taskIndex].comments = tasks[taskIndex].comments || [];
    tasks[taskIndex].comments.push(newComment);

    await setTasks(tasks);
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('clearAll');

    if (clearAll === 'true') {
      await setTasks([]);
      return NextResponse.json({ success: true, cleared: true });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const tasks = await getTasks();
    const filteredTasks = tasks.filter((t: Task) => t.id !== id);

    await setTasks(filteredTasks);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
