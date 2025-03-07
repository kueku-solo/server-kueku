const Transaksi = require('../models/Transaksi')
const Item = require('../models/Item')
const Shift = require('../models/Shift')


class TransaksiCon {
    static findAll(req,res,next){
      let dateAkhir = new Date(req.query.akhir)
      dateAkhir.setDate(dateAkhir.getDate() + 1)
      Transaksi.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}}).sort({_id: -1}).populate('kasir')
                .then(data =>{
                  res.status(200).json(data)
                })
                .catch(next)
    }
    static findByKodeBarang(req,res,next){

      Transaksi.find({'listItem.kodeBarang':req.query.kode}).sort({_id: -1}).populate('kasir')
                .then(data =>{
                  res.status(200).json(data)
                })
                .catch(next)

            // Transaksi.find({'listItem.kodeBarang':req.query.kode})
            //     .then(data =>{
            //       let tempData = []
            //       data.forEach(async element => {
            //         element.listItem.forEach(element2 => {
            //             if(element2.kodeBarang === req.query.kode){
            //               element2.kodeBarang = req.query.kodenew
            //             }
            //         });

            //         await Transaksi.updateOne({_id:element._id},element)
            //         tempData.push(element)
            //       });

            //       res.status(200).json(tempData)
            //     })
            //     .catch(next)
    }    
    static finByNamaBarang(req,res,next){
      Transaksi.find({'listItem.nama':req.query.nama}).sort({_id: -1}).populate('kasir')
                .then(data =>{
                  if(data.length > 0){
                    data.forEach(async element => {
                        for(let i = 0 ; i < element.listItem.length ; i++){
                            if(element.listItem[i].nama === req.query.nama){
                              element.listItem[i].kodeBarang = req.query.kode
                              await Transaksi.updateOne({_id :  element._id},{listItem:element.listItem})
                            }
                        }
                    });
                  }

                  res.status(200).json(data)

                })
                .catch(next)
    }        
    static add(req,res,next){
        // get date now
        function convertTZ(date, tzString) {
          return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
      }
      let getDate = convertTZ(new Date,'Asia/Jakarta')         
      let hour = getDate.getHours()      
      let minute = getDate.getMinutes() 
      // get date now    

      if(Number(hour) < 10){
          hour = `0${hour}`
      } 
      if(Number(minute) < 10){
          minute = `0${minute}`
      }
      req.body.kasir = req.user._id
      Transaksi.create(req.body)
              .then(async data => {
                // update Kasir shift
                await Shift.findOne({'jamKerja.pulang':'-'})
                              .then(async dataShift => {
                                  if(dataShift){
                                    await Shift.updateOne({_id: dataShift._id},{$push : {transaksi: data._id}})
                                  }
                              })
                              .catch(next)  
                // update createdAt
                await Transaksi.updateOne({_id: data._id},{jam:hour+':'+minute})
                // update stok item
                req.body.listItem.forEach(async element => {
                  await Item.updateOne({kodeBarang:element.kodeBarang},{$inc : {stok:-Number(element.qty)}})
                });

                  let tempData = {
                    id : data._id,
                    kasir : req.user.username,
                    jam:hour+':'+minute
                  }
                  res.status(201).json(tempData)
              })
              .catch(next)                             

    }
    static batalTransaksi(req,res,next){
      Transaksi.findOne({_id:req.params.id})
                .then(async data => {
                  if(data){
                    // update Kasir shift
                    await Transaksi.updateOne({_id :  req.params.id},{status: false})
                    // update stok item
                    data.listItem.forEach(async element => {
                      await Item.updateOne({kodeBarang:element.kodeBarang},{$inc : {stok:+Number(element.qty)}})
                    });
                      res.status(201).json(data)
                  }else{
                    next({
                      status: 401,
                      message: 'id salah !'
                  })
                  }
                })
                .catch(next)
  }    
    static update(req,res,next){
        Transaksi.updateOne({_id: req.params.id},req.body)
            .then(respone =>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
    static refundItem(req,res,next){
      Transaksi.findOne({_id:req.params.id})
                .then(async data => {
                  if(data){
                    // update Transaksi list item
                    let tempListItem = []
                    let tempTotalHarga = 0
                    
                    data.listItem.forEach(element => {
                      if(element.kodeBarang === req.body.kodeBarang){
                          element.qty = Number(element.qty) - Number(req.body.jumlah)                        
                      }

                      if(element.qty > 0){
                        element.laba = Number(element.laba) - (Number(req.body.jumlah) * Number(element.harga))
                        tempListItem.push(element)
                        let total = Number(element.qty) * Number(element.harga)
                        tempTotalHarga += total
                      }
                      
                    })

                    await Transaksi.updateOne({_id :  req.params.id},{listItem:tempListItem,totalHarga: tempTotalHarga})

                    

                    // update stok item
                      await Item.updateOne({kodeBarang:req.body.kodeBarang},{$inc : {stok:+Number(req.body.jumlah)}})


                      res.status(201).json(data)
                  }else{
                    next({
                      status: 401,
                      message: 'id salah !'
                    })
                  }
                })
                .catch(next)        
    }
    static destroy(req,res,next){
        Transaksi.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
}

module.exports = TransaksiCon