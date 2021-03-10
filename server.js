const express = require('express');

const app = express();

const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const path = require('path');

connectDB();


app.get('/' , (req,res) =>{
    res.send('hello everyone');
})

app.use(express.json({extended : false}));  // to use body parser


app.use('/User' , require('./routes/user'));

app.listen(PORT, () =>{
    console.log(`its working on port number ${PORT}`)
});