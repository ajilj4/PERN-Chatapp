require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const multer = require('multer')
require('./config/redis')
require('./config/bullmq');

const sequelize = require('./config/db')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const upload = multer()

const routes = require('./routes')
app.use('/api',routes)
app.get('/', (req, res) => res.send('✅ API is working!'));

const server = http.createServer(app)

const PORT = process.env.PORT || 4000;

(async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter:true})
      
        
        server.listen(PORT,()=>{
            console.log('server connected')
        })
    } catch (err) {
        console.log(err)
    }

})()
