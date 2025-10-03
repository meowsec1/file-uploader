require('dotenv').config();
const express = require('express');
const passport = require('./middleware/passport');


const authRouter = require('./routes/auth.js');
const foldersRouter = require('./routes/folders.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(passport.initialize());

app.use('/', authRouter);
app.use('/folders', foldersRouter);



app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error: ", error);
    }
    console.log("Listening on port", process.env.PORT);
})
