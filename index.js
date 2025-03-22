import express from 'express';
import mongoose from "mongoose";
import musicAlbums from "./routes/musicAlbums.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use((req, res, next) => {
    const acceptHeader = req.headers.accept;
    if (req.method !== 'OPTIONS' && acceptHeader !== 'application/json'){
        return res.status(406).json({ error: 'Invalid Accept header' })
    }
    next();
})

mongoose.connect('mongodb://127.0.0.1:27017/musicAlbums');

app.use('/musicAlbums', musicAlbums)

app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${process.env.EXPRESS_PORT}`);
});