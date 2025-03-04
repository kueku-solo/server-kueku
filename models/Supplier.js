const mongoose = require('mongoose')
const Schema = mongoose.Schema

const supplierSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama customer !!']
    },
    alamat: {
        type: String
    },
    kode: {
        type: String
    },    
    noHp: {
        type: String
    },        
    email:{
        type: String
    }
}, {timestamps: true})
supplierSchema.index({nama:'text'})
const customer = mongoose.model('Supplier', supplierSchema)
module.exports = customer