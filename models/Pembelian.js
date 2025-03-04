const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pembelianSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier'
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
        hargaModal:{
            type: Number,            
        },                                     
    }],
    totalHarga: {
        type: Number,
    }, 
    metode: {
        type: String,
        enum: ['Tunai', 'Bon', 'Transfer']
    },
    deskripsi:{
        type: String,
        default:'-' 
    },
    jam:{
        type: String,
        default:'-'
    }
    
}, {timestamps: true})

const x = mongoose.model('Pembelian', pembelianSchema)
module.exports = x