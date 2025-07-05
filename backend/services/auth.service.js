const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const DeviceSession = require('../models/DeviceSession')


const register = async ({ email, name, password, phone ,username}) => {

    const exist = await User.findOne({ where: { email } })
    if (exist) throw new Error('User already exist')
        
    const hashpassword = await bcrypt.hash(password,10)
    const newUser = await User.create({email,password:hashpassword,name,phone,username})
    return newUser
    
}

module.exports = {
    register
}