import express from 'express';
import cors from 'cors';
import { config } from './config';
import userRoutes from './routes/user.routes';
import taskRoutes from './routes/task.routes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);
app.use('/task', taskRoutes);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});