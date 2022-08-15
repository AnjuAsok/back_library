const bcrypt=require('bcrypt');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Pusthakam');
mongoose.connection.on('connected',(req,res)=>{
    console.log("Data base Pusthakam :"+27017);
})

var userSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
});


const UserData=mongoose.model('user',userSchema);
module.exports=UserData;


