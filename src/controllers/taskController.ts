import { Request, Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dateTime, deadline, priority, category } = req.body;
    const task = new Task({
      userId: req.user.id,
      title, description, dateTime, deadline, priority, category
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) { console.error('TASK ERROR:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });

    //  THE WINNING ALGORITHM: Weighted Urgency Score
    const sortedTasks = tasks.sort((a: any, b: any) => {
      const priorityWeight: Record<string, number> = { High: 30, Medium: 20, Low: 10 };
      const scoreA = priorityWeight[a.priority] || 10;
      const scoreB = priorityWeight[b.priority] || 10;

      const now = new Date().getTime();
      const hoursToDeadlineA = Math.max(0, (new Date(a.deadline).getTime() - now) / (1000 * 60 * 60));
      const hoursToDeadlineB = Math.max(0, (new Date(b.deadline).getTime() - now) / (1000 * 60 * 60));
      
      const urgencyA = 70 - Math.min(70, hoursToDeadlineA); 
      const urgencyB = 70 - Math.min(70, hoursToDeadlineB);

      const totalScoreA = scoreA + urgencyA;
      const totalScoreB = scoreB + urgencyB;

      return totalScoreB - totalScoreA; // Descending order (highest urgency first)
    });

    res.json(sortedTasks);
  } catch (error) { console.error('TASK ERROR:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) { console.error('TASK ERROR:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) { console.error('TASK ERROR:', error.message, error.stack);
    res.status(500).json({ message: 'Server error', error });
  }
};
