const mongoose = require('mongoose')
const Schema = mongoose.Schema

const customerSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama customer !!']
    },
    email:{
        type: String
    },
    alamat: {
        type: String,
    },
    noHp: {
        type: String,
    }
}, {timestamps: true})

customerSchema.index({nama:'text'})
const customer = mongoose.model('Customer', customerSchema)
module.exports = customer