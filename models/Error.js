const mongoose = require('mongoose')
const Schema = mongoose.Schema

const errorSchema = new Schema({
    nama: {
        type: Object,
    },
    status: {
        type: Number,
    },
    desc: {
        type: Number,
    }
}, {timestamps: true})

const errors = mongoose.model('Error', errorSchema)
module.exports = errors