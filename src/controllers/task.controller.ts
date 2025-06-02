import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: (req as any).userId }
        });
        return res.status(200).json({
            status: 'success',
            message: 'Todas las tareas',
            tasks
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error fetching tasks',
            error
        });
    }
};

export const getTaskById = async (req: Request, res: Response) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!task) {
            return res.status(404).json({
                status: 'error',
                message: 'Tarea no encontrada'
            });
        }
        return res.status(200).json({
            status: 'success',
            message: 'Detalles de la tarea',
            task
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error fetching task',
            error
        });
    }
};

export const getTasksByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const userId = (req as any).userId;

        if (!['pending', 'completed', 'overdue'].includes(String(status))) {
            return res.status(400).json({
                status: 'error',
                message: 'El parámetro "status" debe ser "pending", "completed" o "overdue"',
            });
        }

        let filter: any = { userId };

        if (status === 'completed') {
            filter.completed = true;
        } else if (status === 'pending') {
            filter.completed = false;
            filter.dueDate = { gte: new Date() };
        } else if (status === 'overdue') {
            filter.completed = false;
            filter.dueDate = { lt: new Date() };
        }

        const tasks = await prisma.task.findMany({ where: filter });

        return res.status(200).json({
            status: 'success',
            message: `Tareas filtradas por estado: ${status}`,
            tasks,
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error searching tasks',
            error,
        });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, dueDate } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                userId: (req as any).userId
            }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Nueva tarea creada',
            task
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error creating task',
            error
        });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { title, description, dueDate } = req.body;

        const task = await prisma.task.update({
            where: { id: Number(req.params.id) },
            data: {
                title,
                description,
                dueDate: new Date(dueDate)
            }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Tarea actualizada',
            task
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error updating task',
            error
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        await prisma.task.delete({
            where: { id: Number(req.params.id) }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Tarea eliminada',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error deleting task',
            error
        });
    }
};

export const completeTask = async (req: Request, res: Response) => {
    try {
        const task = await prisma.task.update({
            where: { id: Number(req.params.id) },
            data: { completed: true }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Tarea completada exitosamente',
            task
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error completing task',
            error
        });
    }
};