import mongoose = require('mongoose');

export interface ITask extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dateTime: Date;
  deadline: Date;
  priority: 'Low' | 'Medium' | 'High';
  category: string;
  isCompleted: boolean;
}

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  dateTime: { type: Date, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  category: { type: String, default: 'General' },
  isCompleted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
