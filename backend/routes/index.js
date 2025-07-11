const express = require('express')
const router = express.Router()

const authRoute = require('./auth.routes')

router.use('/v1/auth',authRoute)

module.exports = router

