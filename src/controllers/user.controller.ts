import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { validateEmail, validatePassword } from '../utils/userValidation';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!validateEmail(email)) {
            return res.status(400).json({
                status: 'error',
                message: 'Formato de correo inválido',
            });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({
                status: 'error',
                message: 'La contraseña debe tener más de 8 caracteres',
            });
        }
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(400).json({
                status: 'error',
                message: 'El correo ya está en uso'
            })
        };
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed
            }
        });
        return res.status(201).json({
            status: 'success',
            message: 'Ha sido registrado exitosamente',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error: any) {
        console.log('Error completo:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            }
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({
                message: 'Correo incorrecto'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Contraseña incorrecta'
            });
        }
        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1d' });
        return res.status(201).json({
            status: 'success',
            message: 'Acceso exitoso al sistema',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error: any) {
        console.error('Error completo:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: {
                name: error?.name,
                message: error?.message,
                stack: error?.stack,
            }
        });
    }
};