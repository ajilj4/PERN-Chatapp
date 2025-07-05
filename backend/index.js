require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
require('./config/redis')
require('./config/bullmq');

const sequelize = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => res.send('✅ API is working!'));

const server = http.createServer(app)

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
      
        
        server.listen(PORT,()=>{
            console.log('server connected')
        })
    } catch (err) {
        console.log(err)
    }

})()
