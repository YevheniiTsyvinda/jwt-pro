const ApiError = require("../exceptions/apiError");

module.exports = function (err,req,res,next){
    console.dir(err);
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message, errors: err})
    }
    return res.status(500).message({message: 'Something went wrong'});
}