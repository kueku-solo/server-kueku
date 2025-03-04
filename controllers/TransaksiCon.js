const Supplier = require('../models/Supplier')
const Customer = require('../models/Customer')
const Item = require('../models/Item')
const HistoryItem = require('../models/HistoryItem')
const Pembelian = require('../models/Pembelian')
const Penjualan = require('../models/Penjualan')


class TransaksiCon {
    static async findAllPembelian(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        Pembelian.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}}).sort({_id: -1}).populate('supplier').populate('admin')
                  .then(data =>{
                    res.status(200).json(data)
                  })
                  .catch(next)
    }

    static async findAllPenjualan(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        Penjualan.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}}).sort({_id: -1}).populate('customer').populate('admin')
                  .then(data =>{
                    res.status(200).json(data)
                  })
                  .catch(next)
    }    

    static async findAllPenjualanByStatus(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        Penjualan.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}, metode: req.query.metode}).sort({_id: -1}).populate('customer').populate('admin')
                  .then(data =>{
                    res.status(200).json(data)
                  })
                  .catch(next)
    }        

    // PEMBELIAN
    static async addPembelian(req,res,next){    
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
        req.body.admin = req.user._id
        req.body.jam = hour+':'+minute


        Pembelian.create(req.body)
                    .then(async data => {
                        let tempSupplier = '-'
                        // update history pembelian supplier                        
                        await Supplier.findOne({_id:req.body.supplier})
                                        .then(async dataSupplier => {
                                            if(dataSupplier){
                                                tempSupplier = dataSupplier.nama
                                                await Supplier.updateOne({_id: dataSupplier._id},{$push : {historyPembelian: data._id}})
                                            }
                                        })
                                        .catch(next)  

                        // update stok item & history item
                        req.body.listItem.forEach(async element => {
                            await Item.updateOne({kodeBarang:element.kodeBarang},{$inc : {stok:Number(element.qty)}})

                            
                            let tempHistoryItem = {
                                item:element.idBarang,
                                harga: element.harga,   
                                admin:req.user._id,
                                action:'Beli',
                                qty: element.qty,
                                tanggal:fullDate,    
                                jam:hour+':'+minute,
                                deskripsi: tempSupplier
                            }
                            await HistoryItem.create(tempHistoryItem)                            
                        })

                        res.status(201).json(data)
                    })
                    .catch(next) 

    }
    
    static updatePembelian(req,res,next){
        Pembelian.findOne({_id:req.params.id})
                .then(data =>{
                    if(data){        
                            Pembelian.updateOne({_id: req.params.id},req.body)
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
    static destroyPembelian(req,res,next){
        Pembelian.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
       
    // Penjualan
    static async addPenjualan(req,res,next){    
        // get date now
        function convertTZ(date, tzString) {
            return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
        }
        let getDate = convertTZ(new Date,'Asia/Jakarta')         
        let hour = getDate.getHours()      
        let minute = getDate.getMinutes() 
        const day = getDate.getDate()
        let month = getDate.getMonth()
        month++
        const year = getDate.getFullYear()
        const fullDate = `${year}-${month}-${day}`
        // get date now    
  
        if(Number(hour) < 10){
            hour = `0${hour}`
        } 
        if(Number(minute) < 10){
            minute = `0${minute}`
        }
        req.body.admin = req.user._id
        req.body.jam = hour+':'+minute
        req.body.tanggal= fullDate

        Penjualan.create(req.body)
                    .then(async data => {
                        let tempCustomer = '-'
                        // update history Penjualan customer
                        if(req.body.customer){
                            await Customer.findOne({_id:req.body.customer})
                                            .then(async dataCustomer => {
                                                if(dataCustomer){
                                                    tempCustomer = dataCustomer.nama
                                                    await Customer.updateOne({_id: dataCustomer._id},{$push : {historyPembelian: data._id}})
                                                }
                                            })
                                            .catch(next)  
                        }

                        // update stok item
                        req.body.listItem.forEach(async element => {
                            await Item.updateOne({kodeBarang:element.kodeBarang},{$inc : {stok:-Number(element.qty)}})

                            // create history
                            let tempHistoryItem = {
                                item:element.idBarang,
                                harga: element.harga,    
                                admin:req.user._id,
                                action:'Laku',
                                qty: element.qty,
                                tanggal:fullDate,    
                                jam:hour+':'+minute,
                                deskripsi: tempCustomer
                            }                            
                            await HistoryItem.create(tempHistoryItem)     
                                                    
                        })

                      
                        res.status(201).json(data)
                    })
                    .catch(next) 
    }
    
    static updatePenjualan(req,res,next){
        Penjualan.findOne({_id:req.params.id})
                .then(data =>{
                    if(data){        
                            Penjualan.updateOne({_id: req.params.id},req.body)
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

    static ubahMetode(req,res,next){
        Penjualan.findOne({_id:req.params.id})
                    .then(data =>{
                        if(data){        
                                Penjualan.updateOne({_id: req.params.id},{metode:req.query.metod})
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

    static destroyPenjualan(req,res,next){
        Penjualan.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }    
}

module.exports = TransaksiCon