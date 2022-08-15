const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const bookdata=require('./modules/book');
const UserData = require('./modules/user');
const path=require('path');

const app=express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.static('./dist/library'))


app.get('/api/',(req,res)=>{
    res.send('god bless you');
})

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }



//SIGNUP
app.post('/api/signup',(req,res)=>{
    console.log(req.body);
    var newuser={
        username:req.body.user.name,
        email:req.body.user.email,
        password:req.body.user.password
    }
    var user=new UserData(newuser);
    user.save();

})

//LOGIN
app.post('/api/login', async(req, res) => {
    try{
    
        const email=req.body.email;
        const password=req.body.password;
        console.log(email)
        console.log(password)
        const useremail=await UserData.findOne({email:email})
        console.log('........usermail.....')
        console.log(useremail.email)
        console.log(useremail.password)
        if(useremail.password===password)
        {
            
            let payload = {subject:email+password}
            let token=jwt.sign(payload,'secretkey')
            res.status(200).send({token});
        }
        else
        {
            res.send('password not matching');
        }
    }
    catch(error)
    {
        res.status(400).send("invalid email");
    }
    
    } );
    
//ADD BOOK
app.post('/api/addbook',(req,res)=>{
    console.log(req.body);
    var newbook={
        title:req.body.book.title,
        auther:req.body.book.auther,
        about:req.body.book.about,
        image:req.body.book.image
    }
    console.log(newbook);
    var book=new bookdata(newbook);
    console.log(book)
    book.save();
})

//DISPLAY BOOK
app.get('/api/books',(req,res)=>{
    bookdata.find().then(function(books){
        res.send(books);

    });

    });
    //GET SELECTED BOOK
    app.get('/api/book/:id',(req,res)=>{
        const id=req.params.id;
        bookdata.findOne({"_id":id})
        .then((book)=>{
            res.send(book)
        })
    });
    
//DELETE BOOK
app.delete('/api/delete/:id',(req,res)=>{
   
    id = req.params.id;
    bookdata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })

  //UPDATE BOOK
  app.put('/api/update/:id',(req,res,next)=>{
    console.log(req.body);
    title=req.body.book.title,
    auther=req.body.book.auther,
    about=req.body.book.about,
    image=req.body.book.image

    bookdata.findByIdAndUpdate({"_id":id},
    {$set:{"title":title,
            "auther":auther,
            "about":about,
            "image":image
    }}).then(function()
    {
        res.send();
    })

});

app.get('/*',(req,res)=>{
    res.sendFile(path.join(__dirname+'./dist/library/index.html'))
})

//SERVER SET
app.listen(process.env.PORT||9000,(req,res)=>{
    console.log('Hi,I am listening');
})

