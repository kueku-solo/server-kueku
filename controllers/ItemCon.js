const Item = require('../models/Item')
const HistoryItem = require('../models/HistoryItem')
const Transaksi = require('../models/Transaksi')
const { generator } = require('../helpers/kodeGenerator')
const JsBarcode = require('jsbarcode')
const { DOMImplementation, XMLSerializer } = require('xmldom')
const { svg2png } = require('svg-png-converter')
const CsvParser = require('json2csv').Parser


class ItemCon {
    static addBarcode(req,res,next){
        Item.find()
            .then(async data=>{
                for(let i = 0 ; i < data.length ; i++){
                    if(data[i].kodeBarcode === false || data[i].kodeBarcode === undefined || data[i].kodeBarcode === '-'){
                        // create barcode
                        const xmlSerializer = new XMLSerializer();
                        const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
                        const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        
                        JsBarcode(svgNode, data[i].kodeBarang, {
                            xmlDocument: document,
                        });
                        
                        const svgText = xmlSerializer.serializeToString(svgNode);        
                        let s = await svg2png({ 
                            input: `${svgText}`.trim(), 
                            encoding: 'dataURL', 
                            format: 'jpeg',
                        })
                        await Item.updateOne({_id:data[i]._id},{kodeBarcode:s})
                    }
                    if(i === 100){
                        console.log(100)
                    }
                }
                res.status(200).json({message:'sukses edit!'})
            })
            .catch(next)
    }
    static async findAll(req,res,next){
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const result = {};
        const totalData = await Item.countDocuments().exec()
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
            result.results = await Item.find({},{ timestamp : 1 , nama : 1 , kodeBarang : 1 , stok : 1, harga: 1, image:1, modal:1} ).limit(limit).skip(startIndex)
            res.status(200).json(result)
        } catch (e) {
          res.status(500).json({ message: e.message });
        }
    }
    static findByKode(req,res,next){
        Item.find({kodeBarang: req.query.kode})
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(next)
    }
    static async findAllHistory(req,res,next){
        HistoryItem.find().populate('item').populate('admin')
                    .then(data =>{
                        res.status(200).json(data)
                    })
                    .catch(next)
    //     const page = parseInt(req.query.page);
    //     const limit = parseInt(req.query.limit);
    //     const startIndex = (page - 1) * limit;
    //     const endIndex = page * limit;
    //     const result = {};
    //     const totalData = await HistoryItem.countDocuments().exec()
    //     result.Total = totalData                         
    //     change model.length to model.countDocuments() because you are counting directly from mongodb
    //     if (endIndex < totalData) {
    //       result.next = {
    //         page: page + 1,
    //         limit: limit,
    //       };
    //     }
    //     if (startIndex > 0) {
    //       result.previous = {
    //         page: page - 1,
    //         limit: limit,
    //       };
    //     }
    //     try {
    //         result.results = await HistoryItem.find({},{ item : 1 , stokLama : 1 , stokBaru : 1 , admin : 1, jam: 1, tanggal:1} ).sort( { age: -1 } ).limit(limit).skip(startIndex).populate('item').populate('admin')
          
    //         res.status(200).json(result)
    //     } catch (e) {
    //       res.status(500).json({ message: e.message });
    //     }
    }
    static searchHistoryByKode(req,res,next){
         Item.findOne({$or: [{'nama': req.query.src}, {'kodeBarang': req.query.src}]}).maxTimeMS(100)
                    .then(async find =>{
                        const result = {};
                        if(find){
                            await HistoryItem.find({item:find._id}).sort( { age: -1 } ).populate('item').populate('admin')
                                                .then(data =>{
                                                    result.Total = data.length
                                                    result.results = data                                                     
                                                })           
                        }else{                            
                            result.Total = 0
                            result.results = []                        
                        }
                        res.status(200).json(result); 
                    })
                    .catch(next)
    }
    static searchHistoryByDate(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        HistoryItem.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir}}).sort({_id: -1}).populate('item').populate('admin').maxTimeMS(100)
                  .then(data =>{
                    res.status(200).json(data)
                  })
                  .catch(next)        
    }
    static async add(req,res,next){
        if(req.body.modal === 0 || req.body.modal === undefined){
            req.body.modal = req.body.harga
        }

        if(req.body.kodeBarang !== '-'){            
            Item.findOne({kodeBarang: req.body.kodeBarang})
                    .then(async respone =>{
                        if(respone){
                            next({
                                status: 401,
                                message: 'kode sudah terdaftar !'
                            })
                        }else{                 
                            Item.create(req.body)
                                .then(data => {
                                    res.status(201).json(data)
                                })
                                .catch(next)
                        }
                    })
                    .catch(next)            
        }else{            
                    // create kode barang
                        let code = generator()
                        let flag = true
                        while(flag){
                        await  Item.findOne({kodeBarang: code})
                                            .then(data =>{
                                                if(data){
                                                    code = generator()
                                                }else{
                                                    flag = false
                                                }
                                            })
                                            .catch(err =>{
                                                console.log(err)
                                            })
                        }     

                      req.body.kodeBarang = code

                      Item.create(req.body)
                          .then(data => {
                              res.status(201).json(data)
                          })
                          .catch(next)                      

        }
    }
    static updateKode(req,res,next){
        Item.findOne({kodeBarang: req.body.kodeBarang})
            .then(async respone =>{
                if(respone){
                    next({
                        status: 401,
                        message: 'kode sudah terdaftar !'
                    })
                }else{
                    await Item.updateOne({_id: req.params.id},{kodeBarang:req.body.kodeBarang})
                    let getItem = await Item.findById(req.params.id) 
                    Transaksi.find({'listItem.nama':getItem.nama}).sort({_id: -1})
                                .then(data =>{
                                if(data.length > 0){
                                    data.forEach(async element => {
                                        for(let i = 0 ; i < element.listItem.length ; i++){
                                            if(element.listItem[i].nama === getItem.nama){
                                            element.listItem[i].kodeBarang = req.body.kodeBarang
                                            await Transaksi.updateOne({_id :  element._id},{listItem:element.listItem})
                                            }
                                        }
                                    });
                                }
                                })
                                .catch(next)

                    const itemNew = await Item.findOne({_id: req.params.id})
                    res.status(200).json(itemNew)
                }
            })
            .catch(next)
    }  
    static updateNama(req,res,next){
        Item.findOne({nama:req.body.nama})
                .then(data =>{
                    if(data){
                        next({
                            status: 401,
                            message: 'nama sudah terdaftar'
                        })
                    }else{
                        Item.updateOne({_id: req.params.id},{nama:req.body.nama})
                            .then(async respone =>{
                                const itemNew = await Item.findOne({_id: req.params.id})
                                res.status(200).json(itemNew)
                            })
                            .catch(next)
                    }
                })
                .catch(next)
    }      
    static updateStok(req,res,next){
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
        if(Number(hour) < 10){
            hour = `0${hour}`
        } 
        if(Number(minute) < 10){
            minute = `0${minute}`
        }     
        const fullHour =  hour+':'+minute      
        // get date now    

        Item.findOne({_id:req.params.id})
                .then(data =>{
                    if(data){
                        Item.updateOne({_id: req.params.id},{stok:Number(req.body.stok)})
                                .then(async respone =>{
                                    const itemNew = await Item.findOne({_id: req.params.id})
                                    await HistoryItem.create({
                                        item: itemNew._id,
                                        stokLama: Number(data.stok),
                                        stokBaru: Number(itemNew.stok),
                                        admin: req.user._id,
                                        tanggal: fullDate,
                                        jam: fullHour
                                    })
                                    res.status(200).json(itemNew)
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
    static update(req,res,next){
        Item.findOne({_id:req.params.id})
                .then(data =>{
                    if(data){        
                            Item.updateOne({_id: req.params.id},req.body)
                                .then(async respone =>{
                                    const itemNew = await Item.findOne({_id: req.params.id})              

                                    res.status(200).json(itemNew)
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
        Item.deleteOne({_id: req.params.id})
            .then(respone=>{
                res.status(200).json(respone)
            })
            .catch(next)
    }
    static async search(req,res,next){
        await Item.findOne({$or: [{'nama': req.query.src}, {'kodeBarang': req.query.src}]}).maxTimeMS(60000)
                    .then(async find =>{
                        const result = {};
                        if(find){
                            result.Total = 1
                            result.results = [find]
                            res.status(200).json(result);               
                        }else{                            
                            Item.find({$text:{$search:`"${req.query.src}"`}}).maxTimeMS(60000)
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
    static async search2(req,res,next){ 
        await Item.findOne({$or: [{'nama': req.query.src}, {'kodeBarang': req.query.src}]}).maxTimeMS(100)
                    .then(async find =>{
                        const result = {};
                        if(find){
                            result.Total = 1
                            result.results = [find]
                            res.status(200).json(result);               
                        }else{                            
                            const page = parseInt(req.query.page);
                            const limit = parseInt(req.query.limit);
                            const startIndex = (page - 1) * limit;
                            const endIndex = page * limit;
                            const totalData = await Item.countDocuments({$text:{$search:`"${req.query.src}"`}}).exec().maxTimeMS(60000)
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
                                let temp  = await Item.find({$text:{$search:`"${req.query.src}"`}},{ timestamp : 1 , nama : 1 , kodeBarang : 1 , stok : 1, hargaGrosir: 1, hargaEcer:1,hargaModal:1} ).sort( { timestamp : -1 } ).limit(limit).skip(startIndex)
                                result.results = temp                                
                                res.status(200).json(result)
                            } catch (e) {
                              res.status(500).json({ message: e.message });
                            }                            
                        }
                    })
                    .catch(next)
    }  

    static async totalLaku(req,res,next){
        let dateAkhir = new Date(req.query.akhir)
        dateAkhir.setDate(dateAkhir.getDate() + 1)
        Transaksi.find({createdAt: {$gte: new Date(req.query.mulai),$lt: dateAkhir},$text:{$search:`"${req.query.name}"`}}).sort({_id: -1})
                  .then(data =>{
                    let dataTemp = []

                    data.forEach((transaction) => {
                        transaction.listItem.forEach((item) => {
                            if (item.nama.includes(req.query.name)) {
                                dataTemp.push(item)
                            }
                        });
                    });


                    let result = [];

                    // Combine similar entries
                    dataTemp.forEach(obj => {
                      let key = obj["nama"];
                      let value = obj["qty"];
                  
                      // Check if the key already exists in the result array
                      let existingEntry = result.find(entry => entry.hasOwnProperty(key));
                  
                      if (existingEntry) {
                        // If the key exists, update the value
                        existingEntry[key] += value;
                      } else {
                        // If the key doesn't exist, add a new entry
                        let newEntry = {"kodeBarang":obj.kodeBarang,"harga": obj.harga};
                        newEntry[key] = value;
                        result.push(newEntry);
                      }
                    });

                        // Function to convert JSON to CSV
                        const convertToCSV = (data) => {
                            const header = ["nama", "qty", "kode barang", "harga"];
                            const rows = data.map(item => {
                                const nama = Object.keys(item).find(key => key !== "kodeBarang" && key !== "harga");
                                const qty = item[nama];
                                const kodeBarang = item.kodeBarang;
                                const harga = item.harga;
                                return [nama, qty, kodeBarang, harga];
                            });

                            return [header.join(",")].concat(rows.map(row => row.join(","))).join("\n");
                        }

                        const csvData = convertToCSV(result);

                        // const csvFields = ["nama","qty","harga","kode barang"];
                        // const csvParser = new CsvParser({ csvFields });
                        // const csvData = csvParser.parse(data);
                    
                        res.setHeader("Content-Type", "text/csv");
                        res.setHeader("Content-Disposition", `attachment; filename=${req.query.name+req.query.mulai}.csv`);
                        
                        res.status(200).end(csvData);  

                    // res.status(200).json(result)
                  })
                  .catch(next)         
    }

    static convertToCsv(req,res,next){        
        Item.find({},{ nama : 1 , kodeBarang : 1 , stok : 1, hargaGrosir: 1, hargaEcer:1} )
                    .then(data =>{                                                                    
                            // res.status(200).json(tutorials);                              
                            const csvFields = ["nama","kodeBarang","stok","hargaGrosir","hargaEcer"];
                            const csvParser = new CsvParser({ csvFields });
                            const csvData = csvParser.parse(data);
                        
                            res.setHeader("Content-Type", "text/csv");
                            res.setHeader("Content-Disposition", "attachment; filename=full.csv");
                            
                            res.status(200).end(csvData);                              

                    })
                    .catch(next)
           
     }         
}

module.exports = ItemCon