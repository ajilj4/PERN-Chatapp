const express = require('express')
const router = express.Router()

const authRoute = require('./auth.routes')
const chatRoute = require('./chat.routes')

router.use('/v1/auth',authRoute)
router.use('/v1/chat',chatRoute)

module.exports = router

