import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB Connected Successfully");
    }catch(error){
        console.log("DB Error", error);
    }
}

export default connectDB;