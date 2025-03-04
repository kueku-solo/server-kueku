const express = require('express')
const route = express.Router()
const CustomerCon = require('../controllers/CustomerCon')
const { authenticateKasir } = require('../middlewares/auth')

route.get('/', CustomerCon.findAll)
route.get('/search', CustomerCon.search)


route.use(authenticateKasir)

route.post('/',CustomerCon.add)
route.put('/:id', CustomerCon.update)
route.delete('/:id', CustomerCon.destroy)




module.exports = route