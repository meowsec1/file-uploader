const express = require('express');
require('dotenv').config();
const authRouter = require('./routes/auth.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true }));


app.use('/', authRouter);




app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error: ", error);
    }
    console.log("Listening on port", process.env.PORT);
})
