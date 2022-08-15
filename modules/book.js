const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/Pusthakam');

var bookSchema=mongoose.Schema({
    title:String,
    auther:String,
    about:String,
    image:String
});

var BookData=mongoose.model('book',bookSchema);
module.exports=BookData;