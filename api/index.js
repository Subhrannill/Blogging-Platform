const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://atlas-sample-dataset-load-67fd18c31d6b6973317c29b2:pxIU2VMx6YUkzpiz@cluster0.5zfjysu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
app.post('/register', (req, res) => {
    const {username, password} = req.body;
  res.json({requestData: {username, password}});
});

app.listen(4000);

//