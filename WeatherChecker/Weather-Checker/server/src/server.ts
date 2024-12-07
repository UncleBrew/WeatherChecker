import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the client dist folder
app.use(express.static('../client/dist'));

// Import the routes
import routes from './routes/index.js';
app.use(routes);

const PORT = process.env.PORT || 3001;

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
