import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Timebase Todo API is running! 🚀' });
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp')
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });
