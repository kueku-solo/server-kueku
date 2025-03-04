const express = require('express')
const route = express.Router()
const user = require('./users')
const item = require('./item')
const supplier = require('./supplier')
const customer = require('./customer')
const transaksi = require('./transaksi')


route.use('/user',user)
route.use('/item',item)
route.use('/supplier',supplier)
route.use('/customer',customer)
route.use('/transaksi',transaksi)

module.exports = route