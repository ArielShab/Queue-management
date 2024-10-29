import express from 'express';
import cors from 'cors';
import usersRouter from './routes/usersRouter.js';
import servicesRouter from './routes/servicesRouter.js';
import queuesRouter from './routes/queuesRouter.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const start = async () => {
	try {
		app.listen(PORT, () => {
			console.log(`listening on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();

app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/queues', queuesRouter);
