const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shiftSchema = new Schema({
    kasir: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    tanggal:{
        type: String
    },    
    jamKerja:{
        masuk: {
            type: String,
            default: '-'
        },
        pulang: {
            type: String,
            default: '-'
        }
    },
    saldoAwal:{
        type: Number
    },
    setor:{
        type:Number,
        default:0
    },
    saldoAkhir:{
        type: Number,
        default:0
    },
    kasMasuk:[
        {
            jam: {
                type: String,
            },
            jumlah:{
                type: Number
            },
            keterangan:{
                type: String
            }
        }
    ],
    kasKeluar:[
        {
            jam: {
                type: String,
            },
            jumlah:{
                type: Number
            },
            keterangan:{
                type: String
            }
        }
    ],
    transaksi:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaksi'
        }
    ],
    selisih:{
        type:Number
    }    
}, {timestamps: true})

const x = mongoose.model('Shift', shiftSchema)
module.exports = x