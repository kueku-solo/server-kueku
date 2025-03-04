const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transaksiSchema = new Schema({
    status:{
        type: Boolean,
        default: true
    },
    customer: {
        type: String,        
    },
    kasir: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },    
    listItem: [{
        kodeBarang:{
            type: String,
        },               
        nama:{
            type: String,
        },              
        qty:{
            type: Number,            
        }, 
        harga:{
            type: Number,            
        },                                     
    }],
    diskon:{
        type: Number
    },
    totalHarga: {
        type: Number,
    },
    bayar: {
        type: Number,
        default: 0
    },    
    pembayaran: {
        type: String,
        enum: ['Tunai', 'Bank', 'Shopee']
    },
    jam:{
        type: String,
        default:'-'
    }
    
}, {timestamps: true})
transaksiSchema.index({'listItem.nama':'text','listItem.kodeBarang':'text'})
const x = mongoose.model('Transaksi', transaksiSchema)
module.exports = x