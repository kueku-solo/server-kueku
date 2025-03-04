const express = require('express')
const route = express.Router()
const user = require('./users')
const item = require('./item')
const transaksi = require('./transaksi')
const shift = require('./shift')
const kategori = require('./kategori')

route.use('/user',user)
route.use('/item',item)
route.use('/transaksi',transaksi)
route.use('/shift',shift)
route.use('/kategori',kategori)

module.exports = route