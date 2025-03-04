const jwt = require('jsonwebtoken')

module.exports = {
    generateToken : function(user){
        const temp = {
            _id: user._id,
            email: user.email,
            username: user.username
        }
        return jwt.sign(temp, process.env.JWT_SECRET)
    },
    verifyToken : function(token){
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}