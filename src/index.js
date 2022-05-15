// SETUP
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000
const users = require('./routes/users')

app.use(express.json());


// ROTAS 
app.get('/', (req, res) => {
    res.json('Backend is running');
});
app.use('/users', users);


app.listen(PORT);
console.log(`[Backend] Service is running at port ${PORT}`);