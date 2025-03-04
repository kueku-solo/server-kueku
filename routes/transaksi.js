const express = require('express')
const route = express.Router()
const TransaksiCon = require('../controllers/TransaksiCon')
const { authenticate , authenticateKasir} = require('../middlewares/auth')

route.get('/pembelian', TransaksiCon.findAllPembelian)
route.get('/penjualan', TransaksiCon.findAllPenjualan)
route.get('/penjualan/status', TransaksiCon.findAllPenjualanByStatus)



route.post('/penjualan',authenticateKasir, TransaksiCon.addPenjualan)
route.post('/pembelian',authenticateKasir, TransaksiCon.addPembelian)
route.put('/metode/:id',authenticateKasir,TransaksiCon.ubahMetode)

route.use(authenticate)


route.put('/penjualan/:id', TransaksiCon.updatePenjualan)
route.delete('/penjualan/:id', TransaksiCon.destroyPenjualan)
route.put('/pembelian/:id', TransaksiCon.updatePembelian)
route.delete('/pembelian/:id', TransaksiCon.destroyPembelian)




module.exports = route