// SETUP
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const users = require('./routes/users')
const petshop = require('./routes/petshop')

app.use(express.json());


// ROTAS 
app.get('/', (req, res) => {
    res.json('Backend is running');
});
app.use('/users', users);
app.use('/petshop', petshop);


app.listen(PORT);
console.log(`[Backend] Service is running at port ${PORT}`);