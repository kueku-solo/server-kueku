const Shift = require('../models/Shift')
const Item = require('../models/Item')


class ShiftCon {
    static async findAll(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        Shift.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}}).sort({_id: -1}).populate('kasir')
                  .then(data =>{
                    res.status(200).json(data)
                  })
                  .catch(next)
    }
    
    static async findAllShiftUser(req,res,next){
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};
        const totalData = await Shift.countDocuments({kasir:req.user._id}).exec()
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
          result.results = await Shift.find({kasir:req.user._id}).limit(limit).skip(startIndex).populate('transaksi')
            res.status(200).json(result)
        } catch (e) {
          res.status(500).json({ message: e.message });
        }
    }
    // kasir
    static findLastShift(req,res,next){
        Shift.find().maxTimeMS(100).sort( { _id: -1 } ).limit(1)
                .then(data =>{        
                        res.status(201).json(data[0])
                })  
                .catch(next)
    }
    static  findShiftAktif(req,res,next){
        Shift.find({'jamKerja.pulang':'-'}).maxTimeMS(60000).populate('transaksi').populate({path: 'transaksi',populate: [{ path: 'kasir' }]})
                .then(data => {
                    res.status(201).json(data)
                })
                .catch(err=>{
                        next({
                            status: 400,
                            message: 'error dari find shift aktif'
                    })
                })               
                    
    }    
    static async mulaiShift(req,res,next){
                        // get date now
                        function convertTZ(date, tzString) {
                            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
                        }
                        let getDate = convertTZ(new Date,'Asia/Jakarta')       
                        const day = getDate.getDate()
                        let month = getDate.getMonth()
                        month++
                        const year = getDate.getFullYear()
                        const fullDate = `${year}-${month}-${day}`

                        let hour = getDate.getHours()
                        let minute = getDate.getMinutes()
                        // get date now    

                        if(Number(hour) < 10){
                            hour = `0${hour}`
                        } 
                        if(Number(minute) < 10){
                            minute = `0${minute}`
                        }         
                        let temp = {
                            kasir: req.user._id,
                            tanggal: fullDate,
                            jamKerja:{
                                masuk: hour+':'+minute
                            },
                            saldoAwal:req.body.saldoAwal
                        }
                        await Shift.find({kasir:req.user._id,'jamKerja.pulang':'-'}).maxTimeMS(60000).populate('transaksi').populate({path: 'transaksi',populate: [{ path: 'kasir' }]})
                                .then(async data => {
                                    if(data.length <= 0){
                                        await Shift.create(temp)
                                                    .then(data2 => {
                                                        res.status(201).json(data2)
                                                    })
                                                    .catch(next)
                                    }else{
                                        next({
                                            status: 401,
                                            message: 'sudah memulai shift !'
                                        })
                                    }
                                })
                                .catch(err=>{
                                    next({
                                        status: 400,
                                        message: 'error dari mulai shift(2)'
                                    })
                                })   
    }                    
    static async selesaiShift(req,res,next){
        // get date now
        function convertTZ(date, tzString) {
            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
        }
        let getDate = convertTZ(new Date,'Asia/Jakarta')        
        const day = getDate.getDate()
        let month = getDate.getMonth()
        month++
        const year = getDate.getFullYear()
        const fullDate = `${year}-${month}-${day}`
        let hour = getDate.getHours()
        let minute = getDate.getMinutes()
        // get date now    

        if(Number(hour) < 10){
            hour = `0${hour}`
        } 
        if(Number(minute) < 10){
            minute = `0${minute}`
        }   

        let temp = {
            'jamKerja.pulang' : hour+':'+minute ,
            setor: req.body.setor,
            saldoAkhir: req.body.saldoAkhir,
            selisih: req.body.selisih
        }
        Shift.updateOne({_id: req.body.id}, {$set: temp})
                .then(respone =>{
                    res.status(201).json(respone)
                })
                .catch(next)        
    }
    static tambahKas(req,res,next){
        let temp = {}
        if(req.body.kas === 'kasKeluar'){
            temp = {$push : {kasKeluar: req.body.data}}
        }else if(req.body.kas === 'kasMasuk'){
            temp = {$push : {kasMasuk: req.body.data}}
        }
        Shift.updateOne({_id: req.params.id},temp)
                .then(respone =>{
                    res.status(200).json(respone)
                })
                .catch(next)
    }    
    static update(req,res,next){
        Shift.updateOne({_id: req.params.id},req.body)
            .then(respone =>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
    static destroy(req,res,next){
        Shift.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
}

module.exports = ShiftCon