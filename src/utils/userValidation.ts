import { z } from 'zod';

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8);

export const validateEmail = (email: string) => {
    try {
        emailSchema.parse(email);
        return true;
    } catch (error) {
        return false;
    }
}

export const validatePassword = (password: string) => {
    try {
        passwordSchema.parse(password);
        return true;
    } catch (error) {
        return false;
    }
}