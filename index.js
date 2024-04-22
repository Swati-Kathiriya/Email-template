const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/Quote');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router);

// Connect to MongoDB database
mongoose.connect('mongodb+srv://swati:lIcsjbmglRJ5CVpY@shimon.gszdeqt.mongodb.net/Quote')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

app.get("/", (req,res) => {
    res.send(`<h1>This is HOMEPAGE 🙌👻🏡</h1>`)
})

// Start the server
const port = 3000; 
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}....`);
  });
