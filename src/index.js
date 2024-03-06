// import config from "config";

import dotenv from 'dotenv';
import connectDB from './db/index.js';
import path from 'path';
import {app} from './app.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

global._basedir = __dirname

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})