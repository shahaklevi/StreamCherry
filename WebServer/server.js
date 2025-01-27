const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const movies = require('./routes/movieRoutes');
const users = require('./routes/userRoutes');
const tokens = require('./routes/tokensRoutes');
const path = require("path");

const categories = require('./routes/categoryRoutes');

require('custom-env').env(process.env.NODE_ENV || 'local', './config');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CONNECTION_STRING:', process.env.CONNECTION_STRING);

mongoose.connect(process.env.CONNECTION_STRING, {})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.json());
app.use('/api/movies', movies);
app.use('/api/categories', categories);
app.use('/api/users', users);
app.use('/api/tokens', tokens);
app.use("/uploads", express.static(path.join(__dirname, "uploadsProfilePicture")));


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

