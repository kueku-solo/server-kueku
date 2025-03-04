const Admin = require('../models/Admin')


const {hashPassword} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const {commparePassword} = require('../helpers/bcrypt')





class UserCon {

    
    // admin
    static async getAllAdmin(req,res,next){

                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const result = {};
                const totalData = await Admin.countDocuments().exec()
                result.Total = totalData                       
            // change model.length to model.countDocuments() because you are counting directly from mongodb
                if (endIndex < totalData) {
                  result.next = {
                    page: page + 1,
                    limit: limit,
                  };
                }
                if (startIndex > 0) {
                  result.previous = {
                    page: page - 1,
                    limit: limit,
                  };
                }
                try {
                  result.results = await Admin.find().limit(limit).skip(startIndex).sort({_id: -1})
                    res.status(200).json(result)
                } catch (e) {
                  res.status(500).json({ message: e.message });
                }                            
    }
    static registerAdmin(req,res,next){
        Admin.create(req.body)
            .then(data => {
                const token = generateToken(data)
                const {email,_id,username,role} = data
                res.status(201).json({
                    message: 'register succsesfully',
                    token: token,
                    user: {
                        email,
                        _id,
                        username,
                        role
                    }
                })
            })
            .catch(next)
    }
    static loginAdmin(req,res,next){
        Admin.findOne({
            email : req.body.email
        })
            .then(async data => {
                if(data.email === req.body.email){
                    if(commparePassword(req.body.password,data.password)){
                        const token = generateToken(data)
                        const {email,_id,username,role} = data
                        res.status(201).json({
                            message: 'login succsesfully',
                            token: token,
                            user: {
                                email,
                                _id,
                                username,
                                role
                            }
                        })
                    }else{
                        next({
                            status: 401,
                            message: 'password is wrong'
                        })
                    }
                }else{
                    next({
                        status:403,
                        message: 'user not found'
                    })
                }
            })
            .catch(next)
    }
    static async editAdmin(req,res,next){
        if(req.body.password === '-' || req.body.password === false){  
                    let temp = {
                        email:req.body.email,
                        username:req.body.username,
                        role:req.body.role
                    } 
                    Admin.updateOne({_id: req.params.id},temp)
                            .then(respone =>{
                                res.status(201).json({
                                    message: 'edit succsesfully',
                                    user: {
                                        email:req.body.email,
                                        _id:req.params.id,
                                        username:req.body.username,
                                    }
                                })
                            })
                            .catch(next)
        }else{            
            req.body.password = hashPassword(req.body.password)            
            Admin.updateOne({_id: req.params.id},req.body)
                    .then(respone =>{
                        res.status(201).json({
                            message: 'edit succsesfully',
                            user: {
                                email:req.body.email,
                                _id:req.params.id,
                                username:req.body.username,
                            }
                        })
                    })
                    .catch(next)
        }
    }

    static deleteAdmin(req,res,next){
        Admin.deleteOne({_id:req.params.id})
        .then(respone =>{
            res.status(200).json(respone)
        })
        .catch(next)
    }


}

module.exports = UserCon