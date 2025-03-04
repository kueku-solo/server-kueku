const Bundling = require('../models/Bundling')
const Item = require('../models/Item')
const Shift = require('../models/Shift')


class BundlingCon {
    static findAll(req,res,next){
      Bundling.find().sort({_id: -1})
                .then(data =>{
                  res.status(200).json(data)
                })
                .catch(next)
    }
    static findById(req,res,next){
      Bundling.find({_id:req.params.id}).sort({_id: -1})
                .then(data =>{
                  res.status(200).json(data)
                })
                .catch(next)
    }    
    static add(req,res,next){
        Bundling.create(req.body)
                  .then(async data => {
                    // update item
                    req.body.item.forEach(async element => {
                      await Item.updateOne({_id:element},{bundling:true})
                    });
                      res.status(201).json(data)
                  })
                  .catch(next)
    }  
    static update(req,res,next){
        Bundling.updateOne({_id: req.params.id},req.body)
            .then(respone =>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
    static destroy(req,res,next){
        Bundling.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
}

module.exports = BundlingCon