import express from "express";

const router = express.Router()

router.get("/", (req, res) => {
    res.send("Hello Server route")
})

export default router