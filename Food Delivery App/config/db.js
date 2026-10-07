import mongoose from "mongoose"


const connectDB = async() => {
    try{
        let res = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongodb connected!" , res.connection.host);
    }catch(err){
        console.log("Mongodb connection error :" , err);
        
    }
}

export default connectDB