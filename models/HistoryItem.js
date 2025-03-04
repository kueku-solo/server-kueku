const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historyItemSchema = new Schema({
    item:{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    harga: {
        type: Number
    },
    qty: {
        type: Number,
    },     
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    action:{
        type: String,
        enum: ['Laku', 'Beli', 'Retur']
    },
    deskripsi:{
        type: String
    },
    tanggal:{
        type: String
    },    
    jam:{
        type: String
    }
}, {timestamps: true})

const history = mongoose.model('HistoryItem', historyItemSchema)
module.exports = history