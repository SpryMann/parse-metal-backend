require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');
const router = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { scheduleParsing } = require('./helpers/parser');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_BASE_URL,
  })
);
app.use('/api', router);
app.use(errorMiddleware);

const port = process.env.PORT || 5001;

async function start() {
  try {
    const server = app.listen(port, () => {
      console.log(`Server started at ${port}`);
    });
    mongoose.connect(process.env.MONGO_URL);
    scheduleParsing();

    process.on('SIGTERM', () => {
      server.close();
    });
  } catch (error) {
    console.log(error);
  }
}

start();
