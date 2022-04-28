// require("dotenv").config()

import express from "express"
import fetch, { FormData } from 'node-fetch'
import multer from 'multer'
import cors from "cors"

const apiPort = process.env.API_PORT || 3002

const storage = multer.memoryStorage()
const upload = multer({ dest: 'uploads/', storage })

const app = express()

app.use(
    cors({
        origin: "http://localhost:3001",
        allowedHeaders: ["Content-Type", "Content-Length"],
        methods: ["POST"],
    })
)

app.post("/upload/google-drive/*", upload.single('Media'), async (req, res) => {
    const googleUrl = req.url.substring(21)

    const fd = new FormData();
    fd.set('Media', req.file);

    const googleRes = fetch(googleUrl, {
        method: "PUT",
        headers: {
            "Content-Length": req.headers["content-length"]
        },
        body: req.file.buffer
    })

    res.status((await googleRes).status).end()
})

app.listen(apiPort, () => console.info(`API Server listening on port ${apiPort}`))