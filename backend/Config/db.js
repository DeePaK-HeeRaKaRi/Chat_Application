const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log('Db Connection Success',conn.connection.host)
    }catch(error){
        console.log('Db conection Error',error)
        process.exit()
    }
}
module.exports = connectDB