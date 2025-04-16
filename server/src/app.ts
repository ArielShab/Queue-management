import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import v1Routes from './routes/v1.ts';

const app = express();
app.use(cors());
app.use(express.json());

app.use(v1Routes);

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
