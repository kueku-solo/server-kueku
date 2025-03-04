const { verifyToken } = require('../helpers/jwt')
const Admin = require('../models/Admin')

module.exports = {
    authenticate : (req, res, next) => {
        try {    
            const user = verifyToken(req.headers.token)  
            Admin.findOne({"_id": user._id})
                    .then (User => {    
                        if (User) {
                            if(User.role === 'super'){
                                req.user = User
                                next()
                            }else{
                                next({
                                    message : 'admin bukan super !',
                                    status : 403
                                })
                            }
                        } else {
                            next({
                                message : 'user not Found',
                                status : 404
                            })
                        }
                    })
                    .catch(err=>{
                        next(err)
                    })     
            
        } catch(err) {  
            next(err)    
        }
    },
    authenticateAdmin : (req, res, next) => {
        try {    
            const user = verifyToken(req.headers.token)  
            Admin.findOne({"_id": user._id})
                    .then (User => {    
                        if (User) {
                            if(User.role === 'super' || User.role === 'admin'){
                                req.user = User
                                next()
                            }else{
                                next({
                                    message : 'admin bukan super / admin !',
                                    status : 403
                                })
                            }
                        } else {
                            next({
                                message : 'user not Found',
                                status : 404
                            })
                        }
                    })
                    .catch(err=>{
                        next(err)
                    })     
            
        } catch(err) {  
            next(err)    
        }
    },    
    authenticateAdminBarcode : (req, res, next) => {
        try {    
            const user = verifyToken(req.headers.token)  
            Admin.findOne({"_id": user._id})
                    .then (User => {    
                        if (User) {
                            if(User.role === 'super' || User.role === 'admin' || User.role === 'barcode'){
                                req.user = User
                                next()
                            }else{
                                next({
                                    message : 'admin bukan super / admin !',
                                    status : 403
                                })
                            }
                        } else {
                            next({
                                message : 'user not Found',
                                status : 404
                            })
                        }
                    })
                    .catch(err=>{
                        next(err)
                    })     
            
        } catch(err) {  
            next(err)    
        }
    },        
    authenticateKasir : (req, res, next) => {
        try {    
            const user = verifyToken(req.headers.token)  
            Admin.findOne({"_id": user._id})
                    .then (User => {    
                        if (User) {
                            req.user = User
                            next()
                        } else {
                            next({
                                message : 'user not Found',
                                status : 404
                            })
                        }
                    })
                    .catch(err=>{
                        next(err)
                    })     
            
        } catch(err) {  
            next(err)    
        }
    },  
    authenticatePinKasir : (req, res, next) => {        
        try {    
            Admin.findOne({"barcode": req.headers.token})
                    .then (User => {    
                        if (User) {                            
                                req.user = User
                                next()
                          
                        } else {
                            next({
                                message : 'user not Found',
                                status : 404
                            })
                        }
                    })
                    .catch(err=>{
                        next(err)
                    })     
            
        } catch(err) {  
            next(err)    
        }
    },      
    ProfileAuth : (req, res, next) => {
        const user = verifyToken(req.headers.token)  
        Admin.findById(user._id)
            .then(order => {
                if (order) { 
                    if (String(order._id) === String(req.params.id)) {
                        next()
                    } else {
                        next({
                            status : 401,
                            message : 'Not Authorized'
                        })
                    }
                } else {
                    next({
                        status : 404,
                        message : 'user not found'
                    })
                }
            })
            .catch(next)
    }   
} 