const express = require('express')
const route = express.Router()
const UserCon = require('../controllers/UserCon')
const { authenticate ,ProfileAuth} = require('../middlewares/auth')

route.get('/admin',authenticate,UserCon.getAllAdmin)
route.post('/admin/login', UserCon.loginAdmin)
route.post('/admin/register' ,authenticate, UserCon.registerAdmin)
route.put('/editUserLogin/:id',ProfileAuth,UserCon.editAdmin)
route.put('/admin/:id',authenticate,UserCon.editAdmin)
route.delete('/:id',authenticate,UserCon.deleteAdmin)




module.exports = route