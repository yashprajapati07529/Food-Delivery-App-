import mongoose from "mongoose"


const connectDB = async() => {
    try{
        const res = await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongodb connected!" , res.connection.host);
    }catch(err){
        console.error("Mongodb connection error :" , err);
        throw err;
    }
}

export default connectDB