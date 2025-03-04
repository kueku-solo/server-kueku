const Error = require('../models/Error')

module.exports = async(err,req,res,next) => {
    let tempErr = {
        nama : err,
        status: ''
    }
    if(err.status){
        tempErr.status = err.status
    }
    if(err.message){
        tempErr.nama = err.message
    }
    

    await Error.create(tempErr)

    let statusCode;
    let messageError = []
    switch(err.name || err.status){
        case'ValidationError':
        statusCode = 422
        for(error in err.errors){
            messageError.push(err.errors[error].message)
        }
        break
        case 'JsonWebTokenError':
            statusCode = 400
            messageError.push('invalid token')
        break
        default :
        statusCode = err.status
        messageError.push(err.message)
    }
    if(!err.status){
        statusCode = 400
        messageError.push("bad request")
    }

    res.status(statusCode).json({errors: messageError})
}