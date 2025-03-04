const mongoose = require('mongoose')
const ItemCon = require('../controllers/ItemCon')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama bundling !!']
    },
    hargaEcer: {
        type: Number,
    },
    hargaGrosir: {
        type: Number,
    },        
    item:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
}, {timestamps: true})
itemSchema.index({nama:'text',kodeBarang:'text'})
const items = mongoose.model('Item', itemSchema)
module.exports = items