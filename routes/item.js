const express = require('express')
const route = express.Router()
const ItemCon = require('../controllers/ItemCon')
const { authenticate, authenticateAdmin, authenticateAdminBarcode} = require('../middlewares/auth')

// route.get('/downloadAllItem',ItemCon.convertToCsv)
route.get('/', ItemCon.findAll)
route.get('/findbykode', ItemCon.findByKode)
route.get('/search', ItemCon.search)
route.get('/search2', ItemCon.search2)
route.get('/editAll',ItemCon.addBarcode)
route.get('/history',ItemCon.findAllHistory)
route.get('/search/history',ItemCon.searchHistoryByKode)
route.get('/search/date/history',ItemCon.searchHistoryByDate)
route.get('/laku',ItemCon.totalLaku)


route.put('/editkode/:id',authenticateAdminBarcode, ItemCon.updateKode)
route.put('/editadmin/:id',authenticateAdmin, ItemCon.updateNama)
route.put('/editstok/:id',authenticateAdmin, ItemCon.updateStok)


route.use(authenticate)

route.post('/',ItemCon.add)
route.put('/:id', ItemCon.update)
route.delete('/:id', ItemCon.destroy)




module.exports = route