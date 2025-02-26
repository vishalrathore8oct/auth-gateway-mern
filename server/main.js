import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hello Server")
})

app.listen(3000, () => {
    console.log("Server Listening on Port 3000");
})