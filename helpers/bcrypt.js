const bcrypt = require('bcryptjs')

module.exports = {
    hashPassword: function(password){
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,salt)
        return hash
    },
    commparePassword: function(password, hashPassword){
        return bcrypt.compareSync(password,hashPassword)
    }
}