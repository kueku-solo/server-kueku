const express = require('express')
const route = express.Router()
const BundlingCon = require('../controllers/BundlingCon')
const { authenticate, authenticateKasir } = require('../middlewares/auth')

route.get('/', BundlingCon.findAll)

route.use(authenticate)

route.post('/', BundlingCon.add)
route.put('/:id', BundlingCon.update)
route.delete('/:id', BundlingCon.destroy)




module.exports = route