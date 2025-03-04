const Customer = require('../models/Customer')
const HistoryItem = require('../models/HistoryItem')
const { generator } = require('../helpers/kodeGenerator')


class CustomerCon {
    static async findAll(req,res,next){
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};
        const totalData = await Customer.countDocuments().exec()
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
            result.results = await Customer.find().limit(limit).skip(startIndex)
            res.status(200).json(result)
        } catch (e) {
          res.status(500).json({ message: e.message });
        }
    }

    static async add(req,res,next){
        Customer.create(req.body)
            .then(data => {
                res.status(201).json(data)
            })
            .catch(next)                      

    }
    
    static update(req,res,next){
        Customer.findOne({_id:req.params.id})
                .then(data =>{
                    if(data){        
                            Customer.updateOne({_id: req.params.id},req.body)
                                .then(async respone =>{                                            
                                    res.status(200).json(respone)
                                })
                                .catch(next)
                    }else{
                        next({
                            status: 401,
                            message: 'id salah'
                        })
                    }
                })
                .catch(next)            
    }
    static destroy(req,res,next){
        Customer.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
    static async search(req,res,next){
        await Customer.findOne({$or: [{'nama': req.query.src}, {'noHp': req.query.src}, {'email':req.query.src}]}).maxTimeMS(100)
                    .then(async find =>{
                        const result = {};
                        if(find){
                            result.Total = 1
                            result.results = [find]
                            res.status(200).json(result);               
                        }else{                            
                            Customer.find({$text:{$search:`"${req.query.src}"`}})
                                .then(data =>{
                                    result.Total = data.length
                                    result.results = data
                                    res.status(200).json(result);                  
                                })
                                .catch(next)                             
                        }
                    })
                    .catch(next)        
    }   
       
}

module.exports = CustomerCon