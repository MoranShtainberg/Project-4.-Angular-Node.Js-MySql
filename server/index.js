//imports
const express = require('express')
const cros = require('cors')
const dotenv = require('dotenv')
require('./db');
const path = require('path');

//init
const app = express()
dotenv.config()

//middlewere
app.use( cros() )
app.use( express.json() )


//routs
app.use('/api/auth', require('./routes/auth') )
app.use('/api/cart', require('./routes/cart') )
app.use('/api/market', require('./routes/market') )
app.use('/api/order', require('./routes/order') )
app.use('/api/thank_you', require('./routes/thank_you') )
app.use('/api/userMain', require('./routes/userMain') )

app.get('/', (req, res)=>{
    res.send("<h1>Welcome</h1>")
})

app.get('/receipts/:cartId',(req, res)=>{
    const file = path.join(__dirname, `./receipts/${req.params.cartId}.txt`);

    res.download(file);
}) 

//run the server
app.listen(1000, ()=>console.log('server is listening on port 1000. visit: http://localhost:1000'))
