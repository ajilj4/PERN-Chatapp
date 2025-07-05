const jwt = require('jsonwebtoken')

const generateAccessToken = (payload)=>{
     jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
        expiresIn:'15m'
     })
}

const generateRefreshToken = (payload)=>{
     jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:'7d'
     })
}

const verifyAccessToken = (token)=> jwt.verify(token,process.env.JWT_ACCESS_SECRET)
const verifyRefreshToken = (token)=> jwt.verify(token,process.env.JWT_REFRESH_SECRET)

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}