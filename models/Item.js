const mongoose = require('mongoose')
const ItemCon = require('../controllers/ItemCon')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama barang !!']
    },
    supplier:{
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
    },    
    hargaModal: {
        type: Number
    },
    harga: {
        type: Number
    },
    stok: {
        type: Number
    },   
    kodeBarang: {
        type: String
    },
    deskripsi:{
        type: String
    }
}, {timestamps: true})

itemSchema.index({nama:'text',kodeBarang:'text'})
const items = mongoose.model('Item', itemSchema)
module.exports = items