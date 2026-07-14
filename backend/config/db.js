import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbconnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI).then(
            console.log("mongodb is connected")
        )
    }catch(err)
    {
        console.log(err);
    }
    
}


export default dbconnect;