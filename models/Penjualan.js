const mongoose = require('mongoose')
const Schema = mongoose.Schema

const penjualanSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },    
    listItem: [{
        idBarang:{
            type: String
        },
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
        }                                     
    }],
    totalHarga: {
        type: Number,
    },
    bayar: {
        type: Number,
        default: 0
    },        
    metode: {
        type: String,
    },
    deskripsi:{
        type: String,
        default:'-' 
    },
    tanggal:{
        type: String,
        default:'-'
    },
    jam:{
        type: String,
        default:'-'
    },
    laba: {
        type: Number,
    }    
}, {timestamps: true})

const x = mongoose.model('Penjualan', penjualanSchema)
module.exports = x