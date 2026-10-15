const errorHandler = (err , req , res , next) => {
    console.log(err);

    res.status(err.status || 500).json({
        success:true,
        message:err.message || "Something went wrong"
    })
    
}

export default errorHandler