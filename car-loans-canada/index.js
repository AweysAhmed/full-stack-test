const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// import routes
const authRoute = require('./routes/auth');

dotenv.config();


// connect to database
mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true} ,
() => console.log('connected to DB'));



//Middleware
app.use(express.json());

// Middleware for routes
app.use('/api/user', authRoute);



app.listen(3000, () => console.log('Server is running'));
