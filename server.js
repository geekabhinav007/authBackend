const express = require('express')

const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//calling Database function
require('./config/database').connect()

//route importing and mounting
const user = require('./routes/user')

app.use('/api', user)

app.get("/", (req, res) => {
    res.send("Welcom To User Authentication API Backend.");
});


app.listen(PORT, () => {
    console.log("Server Started")

})