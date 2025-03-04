const express = require('express')
const route = express.Router()
const KategoriCon = require('../controllers/KategoriCon')
const { authenticate } = require('../middlewares/auth')

route.get('/',authenticate, KategoriCon.findAll)
route.post('/',authenticate, KategoriCon.add)
route.put('/:id',authenticate, KategoriCon.update)
route.delete('/:id',authenticate, KategoriCon.destroy)


module.exports = route