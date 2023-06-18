// index.js
const express = require("express");
const app = express();
const taskRoute = require("./routes/tasks");
const connectDB = require("./db/connect");
const fs = require("fs");
const https = require("https");
require("dotenv").config();

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(express.json());
app.use(express.static("public"));
app.set("port", process.env.PORT || 3000);

// task api routing settings
app.use("/api/v1/tasks", taskRoute);

/* const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(app.get("port"), () => {
        console.log(`The server is running at http://localhost:${app.get("port")}.`);
    });
    } catch (err) {
        console.log(err);
    }    
} */

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        https.createServer({
            key: fs.readFileSync(process.env.PRIVATE_KEY),
            cert: fs.readFileSync(process.env.CERT_FILE)
        }, app).listen(app.get("port"), () => {
            console.log(`The server is running at PORT:${app.get("port")}.`);
        });
    } catch (err) {
        console.log(err);
    }
} 
start();
