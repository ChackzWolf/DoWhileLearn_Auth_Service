import express from 'express';
import morgan from 'morgan';
import logger from './Configs/logger.config';
const app = express();

// Use Morgan for logging HTTP requests
app.use(morgan('combined')); // 'combined' is a predefined format


// Error handling middleware
const errorHandler = (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(err.stack || err.message);
    res.status(500).send('Something broke!');
};

app.use(errorHandler);

