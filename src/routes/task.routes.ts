import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    completeTask
} from '../controllers/task.controller';

const taskRouter = Router();

taskRouter.get('/', authMiddleware, getTasks);
taskRouter.get('/:id', authMiddleware, getTaskById);
taskRouter.post('/', authMiddleware, createTask);
taskRouter.put('/:id', authMiddleware, updateTask);
taskRouter.delete('/:id', authMiddleware, deleteTask);
taskRouter.patch('/:id/complete', authMiddleware, completeTask);

export default taskRouter;