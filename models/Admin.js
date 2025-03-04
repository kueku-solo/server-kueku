const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hashPassword} = require('../helpers/bcrypt')
const emailValidator = require('email-validator')

const adminSchema = new Schema({
    username : {
        type: String,
        required: [true, 'you must enter your username']
    },
    email : {
        type: String,
        required: [true, 'you must enter your email'],
        validate:{
            validator: function (v){
                if(emailValidator.validate(v)){
                    return admins.findOne({
                        email : v
                    })
                    .then(data=>{
                        if(data){
                            return false
                        }else{
                            return true
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }else{
                    return false
                }
            },
            msg: 'email error'
        }
    },
    password : {
        type: String,
        required:[true, 'you must enter your password']
    },
    role : {
        type: String,
    },
})

adminSchema.pre('save', function(next){
    this.password = hashPassword(this.password)
    next()
})

const admins = mongoose.model('Admin', adminSchema)
module.exports = admins