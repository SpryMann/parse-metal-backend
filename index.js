require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
  mongoose.connect(process.env.MONGO_URL);
});
