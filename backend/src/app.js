import express from 'express';
import sequelize from './config/database.js';
import cors from 'cors';
import promotionRoutes from './routes/promotionRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    message: 'Promotions API is running',
  });
});

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();

    res.status(200).json({
      status: 'ok',
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
    });
  }
});

app.use('/api/promotions', promotionRoutes);

export default app;