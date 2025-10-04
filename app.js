require('dotenv').config();
const express = require('express');
const passport = require('./middleware/passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRouter = require('./routes/auth.js');
const routers = require('./routes/folders.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(passport.initialize());

app.use('/', authRouter);
app.use('/folders', routers.foldersRouter);

app.use('/', routers.shareRouter);


app.listen(process.env.PORT, (error) => {
    if (error) {
        console.log("Error: ", error);
    }
    console.log("Listening on port", process.env.PORT);
})
