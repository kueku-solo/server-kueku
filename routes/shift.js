const express = require('express')
const route = express.Router()
const ShiftCon = require('../controllers/ShiftCon')
const { authenticate, authenticateKasir, authenticatePinKasir } = require('../middlewares/auth')

route.get('/last', ShiftCon.findLastShift)
route.get('/',authenticate, ShiftCon.findAll)
route.get('/all/user',authenticate, ShiftCon.findAllShiftUser)
route.get('/kasir/login',authenticateKasir,ShiftCon.findShiftAktif)
route.post('/kasir/mulai',authenticatePinKasir,ShiftCon.mulaiShift)
route.put('/kasir/selesai',authenticateKasir,ShiftCon.selesaiShift)
route.put('/tambahKas/:id',authenticateKasir, ShiftCon.tambahKas)
route.put('/:id',authenticateKasir, ShiftCon.update)
route.delete('/:id', ShiftCon.destroy)




module.exports = route