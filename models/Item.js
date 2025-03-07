const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama barang !!']
    },
    stok: {
        type: Number
    },
    modal: {
        type: Number
    },
    harga: {
        type: Number
    },
    kodeBarang:{
        type: String,
        default: '-'
    },
    image:{
        type: String
    },

}, {timestamps: true})
itemSchema.index({nama:'text',kodeBarang:'text'})
const items = mongoose.model('Item', itemSchema)
module.exports = items