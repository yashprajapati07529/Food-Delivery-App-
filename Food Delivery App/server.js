import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT 

connectDB();

app.get("/", (req, res) => {
    res.send("node.js employee and book api");

})

app.listen(PORT,(err) => {
    err ? console.log(err) : console.log(`Server Start : http://localhost:${PORT}`);
})