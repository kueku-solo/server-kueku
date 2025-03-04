const mongoose = require('mongoose')
const Schema = mongoose.Schema

const kategoriSchema = new Schema({
    nama: {
        type: String,
        required:[true, 'isi nama kategori !!']
    }
})
kategoriSchema.index({nama:'text'})
const kategori = mongoose.model('Kategori', kategoriSchema)
module.exports = kategori