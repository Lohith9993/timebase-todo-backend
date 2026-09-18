import express = require('express');
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, taskController.createTask);
router.get('/', protect, taskController.getTasks);
router.patch('/:id', protect, taskController.updateTask);
router.delete('/:id', protect, taskController.deleteTask);

export = router;
