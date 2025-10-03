const express = require('express');
const passport = require('./middleware/passport');
require('dotenv').config();
const authRouter = require('./routes/auth.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(passport.initialize());

app.use('/', authRouter);




app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error: ", error);
    }
    console.log("Listening on port", process.env.PORT);
})
