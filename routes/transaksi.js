const express = require('express')
const route = express.Router()
const TransaksiCon = require('../controllers/TransaksiCon')
const { authenticate, authenticatePinKasir } = require('../middlewares/auth')

route.get('/',authenticate, TransaksiCon.findAll)
route.get('/by', TransaksiCon.findByKodeBarang)
route.get('/by/name', TransaksiCon.finByNamaBarang)
route.post('/',authenticatePinKasir, TransaksiCon.add)
route.put('/batal/:id',authenticate, TransaksiCon.batalTransaksi)
route.put('/refund/:id',authenticate, TransaksiCon.refundItem)

route.use(authenticate)

route.put('/:id', TransaksiCon.update)
route.delete('/:id', TransaksiCon.destroy)




module.exports = route