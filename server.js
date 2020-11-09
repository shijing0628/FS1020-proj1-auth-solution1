const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

//midlleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


//import routes
const userRoute = require('./routes/user');
const entriesRoute = require('./routes/contact-form');
const authRoute = require('./routes/auth');


//Route Middleware
app.use('/user', userRoute);
app.use('/contact_form', entriesRoute);
app.use('/auth', authRoute);

app.listen(5000, () => console.log('Server is running!'))