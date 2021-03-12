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
app.use('/Admin' , require('./routes/Admin'));
app.use('/Adminlog' , require('./routes/adminAuth'))
app.use('/Add' , require('./routes/Products'))
app.use('/login' , require('./routes/auth'));

app.listen(PORT, () =>{
    console.log(`its working on port number ${PORT}`)
});