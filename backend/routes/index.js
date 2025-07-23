const express = require('express')
const router = express.Router()

const authRoute = require('./auth.routes')
const chatRoute = require('./chat.routes')
const subscriptionRoute = require('./subscription.routes')
const usersRoute = require('./users.routes')

router.use('/v1/auth', authRoute)
router.use('/v1/chat', chatRoute)
router.use('/v1/subscription', subscriptionRoute)
router.use('/v1/users', usersRoute)

module.exports = router

