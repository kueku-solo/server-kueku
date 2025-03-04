module.exports = (err,req,res,next) => {
    // console.log(err, 'ini eror')
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
    // console.log(messageError)
    res.status(statusCode).json({errors: messageError})
}