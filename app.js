require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const multer  = require('multer');
const path =require('path');
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoDBSession = require('connect-mongodb-session')(session);
const nodemailer = require('nodemailer');
const app = express();
app.use(express.urlencoded({extended: false}));
//const uri = process.env.DB_HOST;
// const db = "mongodb://localhost:27017/userDB";


// "mongodb://localhost:27017/productDB");
// "mongodb+srv://Shivraj_Bande:Shivraj7995@cluster0.1ikvl.mongodb.net/userDB?retryWrites=true&w=majority";
mongoose.connect(process.env.DB_HOST,{
useNewUrlParser:true,
}).then(()=>{
    console.log("success")

}).catch((err)=> console.log("not"));

var transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth: {
      user: process.env.email,
      pass: process.env.password
    }
  });



const store = new MongoDBSession({
    uri:db,
    collection:'users',
})
app.use(session({
    secret: 'keyboard  new cat',
    resave: true,
    saveUninitialized: false,
    store:store,
    
    //cookie: { secure: true }
  }))


  const isAuth = (req,res,next)=>{
      if(req.session.isAuth)
      {
          next();
      }
      else{
          res.redirect("/signin");
      }
  }

  app.set("view engine","ejs");
  


var parentid;
const UserSchema = mongoose.Schema({
    name:String,
   
    email:String,
    password:String,
   // phonenumber:Number,
   session:String,
    auction: [{
        //id1:String,
           name:String,
            amount: Number,
            start:String,
            end:String,
            img:String,
    }],
    bidders : [{
           name:String,
           amount:Number,//instead keep amount number
           img:String,
             details : [{ name:String, amountbidded:Number,email:String,}] 
     }]
});

const storage = multer.diskStorage({
    destination:function(req,file,callabck){
        callabck(null,"./public/uploads/");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' +Date.now() + 
        path.extname(file.originalname));
    }
});

const upload = multer({
    storage :storage
}).single("image_file");





app.use(express.static("public"));
const User = mongoose.model('User',UserSchema);

//let's create routes to what happens


//first login detiles route
app.get("/",(req,res)=>{
   // req.session.isAuth = true;

     res.sendFile(__dirname+"/public/index.html");
})
app.post("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/");
    })

})
var parentid;
app.post("/",async(req,res)=>{
    
         const userpassword = req.body.password;
         const confirm_user_password = req.body.cpassword;
        //   console.log(userpassword);
        //   console.log(confirm_user_password);
         if(userpassword===confirm_user_password)
         {
         const securePassword = await bcrypt.hash(userpassword,10);
        // console.log(securePassword);
        
        const users = new User({
            name:req.body.name,
            email:req.body.email,
            password:securePassword,

        })
        const saved_details = await users.save();
        //console.log(saved_details);
        parentid = (saved_details._id).toString();
           
          req.session.isAuth=true;
         // console.log(parentid);
          res.redirect(`/home?name=${parentid}`);
        }
        else{
            req.session.isAuth=false;
            // res.redirect("/");
        }
     
    
})
app.get("/signin",(req,res)=>{
    res.sendFile(__dirname + "/public/signin.html")

})

app.post("/signin" ,async(req,res)=>{
    const detail = await User.find({email:req.body.email,name:req.body.name});
    const userpassword = req.body.password;
    if(detail.length>0)
    {
        const hashpassword = detail[0].password;
        const resu = await bcrypt.compare(userpassword , hashpassword);
       
        if(resu)
        { 
            req.session.isAuth = true;
            parentid = (detail[0]._id).toString();
            var id = parentid;
             res.redirect(`/home?name=${parentid}`);
          
        }
        else

        {
            req.session.isAuth = false;
            res.redirect("/");
        }
    }
    else
    {
        
        res.redirect("/");
    }

})

app.get("/home" , isAuth,async(req,res)=>{
   // console.log(req.query.name);
    var id = req.query.name;
   res.render('home',{records:id});
   
})

app.get("/howItWorks",isAuth,(req,res)=>{
    res.sendFile(__dirname+"/public/howItWorks.html");
})
var id;
app.get("/wanttoauction",isAuth,(req,res)=>{
     id = (req.query.name);

res.render("wantoauction",{records:id});
  
})

app.post("/wanttoauction",upload, async(req,res,next)=>{
    
    let inser = {
        name:req.body.username,
        amount: req.body.base_price,
        start:req.body.start,
        end:req.body.end,
        img : req.file.filename,
    }
    let buy = {
       name:req.body.username,
       img : req.file.filename,
       amount:req.body.base_price,
    }
    
      const users = await User.findById(id);
    //inserting into the array
       const k =  await users.updateOne({$push: { auction:inser }});

       const l = await users.updateOne({$push: { bidders:buy }});
       
   users.save();
       
      res.redirect(`/exploreauction?name=${id}`);

})

app.get('/exploreauction',isAuth,(req,res) =>{
    const id = (req.query.name);
    User.find({},function(err,use){
        res.render("index",{ records:{use,id}})
     })
});


//buyer
var na,auctionid;
app.get("/buyer",isAuth,async(req,res)=>{

na = (req.query.myVar);
auctionid = req.query.name;

const userdata = await User.find({"auction.name" : na});



var img,amounti;
for(var j = 0 ; j < userdata[0].auction.length;j++)
{
    if(userdata[0].auction[j].name==na)
    {
        img = userdata[0].auction[j].img;
        amounti = userdata[0].auction[j].amount;

    }
}
var data,mini=0,img,found = 0;
var size = userdata[0].bidders.length;

for(var i = 0; i < size ; i++)
{
   // console.log(userdata[0].bidders[i].name);
    if((userdata[0].bidders[i].name)===na)
    {
       
        for(var j = 0 ; j < userdata[0].bidders[i].details.length;j++)
        {

                if(userdata[0].bidders[i].details[j].amountbidded > mini)
                {
                   
                    mini = userdata[0].bidders[i].details[j].amountbidded ;
                   
                }
        }
        break;
    }
   
   
}

data ={
    namei:na,
    amount:amounti,
    min:mini,
    img:img
}
res.render("buyer",{records:data});
})
app.post("/buyer",async(req,res)=>{
  var inti = {
        name:req.body.username,
        amountbidded:req.body.biddprice,
        email:req.body.email
  }

const filter ={"bidders.name" : na};
  const productcollection = await User.findOneAndUpdate(filter,{ $push :{"bidders.$.details":inti } },{new:true}
);
  
  res.redirect(`/exploreauction?name=${auctionid}`);
     
 })
 //winner

app.get("/winner",isAuth,async(req,res)=>{
    product = (req.query.myVar1);
    var na = product;
const userdata = await User.find({"bidders.name" : product});
var id1 = userdata[0]._id;
var data,mini=0,id3,i,j,k,l,id2,username;
var size = userdata[0].bidders.length;
for(i = 0; i < size ; i ++)
{
  
    if((userdata[0].bidders[i].name)=== na)
    {
        id2 = userdata[0].bidders[i]._id;
      
       
        for(j = 0 ; j < userdata[0].bidders[i].details.length;j++)
        {
          
                if(userdata[0].bidders[i].details[j].amountbidded > mini)
                {
                   
                    mini = userdata[0].bidders[i].details[j].amountbidded ;
               
                       k = j;
                   
                }
        }
        id3 = userdata[0].bidders[i].details[k]._id;
        emailsend = userdata[0].bidders[i].details[k].email;
        username = userdata[0].bidders[i].details[k].name;
        break;
    }
   // console.log(username);
}
var namei,min;
data = {
     namei:username,
    min:mini,
}

if(emailsend!=null){
var mailOptions = {
    from: fromsecond,
    to: emailsend,
    subject: 'From eauction',
    text: 'Congratulations!! you are the winner of auction',
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
const resu = await User.findByIdAndUpdate({_id:id1},
    {$set :{'bidders.$[f].details.$[s].email':null}},
    {arrayFilters : [{'f._id':id2},{'s._id':id3}]});
    

}
else{
    console.log('email already sent!!!');
}

 res.render("winner",{records:data});
})

let port = process.env.port;
if(port==null || port==""){
    port = 3000;
}

app.listen(port ,()=>{
    console.log("server is listening");
});