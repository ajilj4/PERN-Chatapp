require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const multer = require('multer')
require('./config/redis')
require('./config/bullmq');
const initSocket = require('./config/socket');
const sequelize = require('./config/db')


const db = require('./models/index')

const app = express()

app.use(cors({
    origin:'*'
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const upload = multer()
const routes = require('./routes')
const model = require('./models')

app.use('/api', routes)
app.get('/', (req, res) => res.send('✅ API is working!'));

// Create HTTP server and attach Socket.IO
const server = http.createServer(app)
const io = initSocket(server); // Pass the HTTP server to initSocket

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
            console.log(`Socket.IO server initialized`)
        })
    } catch (err) {
        console.log(err)
    }
})()