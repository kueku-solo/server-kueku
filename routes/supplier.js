const express = require('express')
const route = express.Router()
const SupplierCon = require('../controllers/SupplierCon')
const { authenticateKasir } = require('../middlewares/auth')

route.get('/', SupplierCon.findAll)
route.get('/search', SupplierCon.search)


route.use(authenticateKasir)

route.post('/',SupplierCon.add)
route.put('/:id', SupplierCon.update)
route.delete('/:id', SupplierCon.destroy)




module.exports = route