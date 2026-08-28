import './config/env.js';

import app from './app.js';
import sequelize from './config/database.js';

import './models/index.js';

const PORT = process.env.BACKEND_PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();

    console.log('Database connection established successfully.');

    await sequelize.sync();
    console.log('Database synchronized.');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();