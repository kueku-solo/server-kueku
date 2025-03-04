const mongoose = require('mongoose')
const Schema = mongoose.Schema

const historyItemSchema = new Schema({
    item:{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    stokLama: {
        type: Number,
    },
    stokBaru: {
        type: Number,
    },     
    admin:{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
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