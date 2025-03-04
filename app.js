if(process.env.NODE_ENV === 'development'){
    require ('dotenv').config()
}
const express =require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const port = process.env.PORT || 3000
app.listen(port,function(){
    console.log('run on port =====> ', port)
})
app.get('/',function(req,res){
    res.send('connect success..')
})

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true, family: 4})
        .then(() => {            
            console.log('connect to database')
        })
        .catch(err =>{
            console.log(err)
        })

app.use(cors())
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb', extended: true}))

app.use('/',routes);

app.use(errorHandler)



module.exports = app