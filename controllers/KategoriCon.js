const Kategori = require('../models/Kategori')

class KategoriCon {
    static findAll(req,res,next){
        Kategori.find()
                    .then(data =>{
                    res.status(200).json(data)
                    })
                    .catch(next)
    }
    static add(req,res,next){
        Kategori.create(req.body)
                .then(async data => {
                    res.status(201).json(data)
                })
                .catch(next)                             
    }
    static update(req,res,next){       
        Kategori.updateOne({_id: req.params.id},req.body)
            .then(async respone =>{      
                res.status(200).json(respone)
            })
            .catch(next)        
    }
    static destroy(req,res,next){
        Kategori.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
}

module.exports = KategoriCon