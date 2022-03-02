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
<<<<<<< HEAD
=======
//const db = "mongodb://localhost:27017/userDB";
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e

// const redis = require('redis');
// const client = redis.createClient({
//     host: '127.0.0.1',
//     port:6379,
//     password: process.env.password
// });

// client.on('error', err => {
//     console.log('Error ' + err);
// });

<<<<<<< HEAD


//"mongodb://localhost:27017/productDB");
//"mongodb+srv://Shivraj_Bande:Shivraj7995@cluster0.1ikvl.mongodb.net/userDB?retryWrites=true&w=majority";
=======
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
mongoose.connect(process.env.mongodbURL,{
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
    uri:process.env.mongodbURL,
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

           name:String,
            amount: Number,
            start:String,
            end:String,
            img:String,
            descri:String,
    }],
    bidders : [{
           name:String,
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
app.get("/logout",(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect("/");
    })
})

var parentid;
app.post("/",async(req,res)=>{
    
         const userpassword = req.body.password;
         const confirm_user_password = req.body.cpassword;
       
         if(userpassword===confirm_user_password)
         {
         const securePassword = await bcrypt.hash(userpassword,10);
       
        
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
         req.session.name = parentid;
<<<<<<< HEAD
        // console.log(req.session);
=======
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
          res.redirect("/home");
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
   // console.log(detail);
    const userpassword = req.body.password;
    if(detail.length>0)
    {
        const hashpassword = detail[0].password;
        const resu = await bcrypt.compare(userpassword , hashpassword);
       
        if(resu)
        { 
            req.session.isAuth = true;
<<<<<<< HEAD
           
            req.session.name  = detail[0]._id.toString();
            

=======
            req.session.name  = detail[0]._id.toString();
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
             res.redirect("/home");
          
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
<<<<<<< HEAD
//     var id = req.query.name;
//    res.render('home',{records:id});
res.sendFile(__dirname+"/public/home.html");
=======
   res.sendFile(__dirname+"/public/home.html");
  // res.render('home',{records:id});
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
   
})

app.get("/howItWorks",isAuth,(req,res)=>{
    res.sendFile(__dirname+"/public/howItWorks.html");
})
var id;
app.get("/wanttoauction",isAuth,(req,res)=>{
<<<<<<< HEAD
    id = (req.session.name);
//      console.log(req.session.name);
// res.render("wantoauction",{records:id});
=======
     id = req.session.name;

>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
res.sendFile(__dirname+"/public/wanttoauction.html");
  
})

app.post("/wanttoauction",upload, async(req,res,next)=>{
   
    let inser = {
        name:req.body.username,
        amount: req.body.base_price,
        start:req.body.start,
        end:req.body.end,
        img : req.file.filename,
        descri:req.body.desp
    }
    let buy = {
       name:req.body.username,
<<<<<<< HEAD
    //    img : req.file.filename,
    //    amount:req.body.base_price,
        
=======
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
    }
    
      const users = await User.findById(id);
    //inserting into the array
       const k =  await users.updateOne({$push: { auction:inser }});

       const l = await users.updateOne({$push: { bidders:buy }});
       
   users.save();
       
      res.redirect("/exploreauction");

})

app.get('/exploreauction',isAuth,(req,res) =>{
<<<<<<< HEAD
    const id = (req.session.name);
=======
    // console.log(req.session.name);
    // const id = (req.session.name);
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
    
    User.find({},function(err,use){
       // console.log(use);
        res.render("index",{ records:{use,id}})
     })
});


//buyer
var na;
app.get("/buyer",isAuth,async(req,res)=>{

<<<<<<< HEAD
 na = (req.query.myVar);
//console.log(req.session.name);
//console.log(na);
=======
na = (req.query.myVar);
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
auctionid = req.session.name;

const userdata = await User.find({"auction.name" : na});

// console.log(userdata[0]);
// console.log(na);
var img,amounti,despi;

for(var j = 0 ; j < userdata[0].auction.length;j++)
{
    if(userdata[0].auction[j].name==na)
    {
        img = userdata[0].auction[j].img;
        amounti = userdata[0].auction[j].amount;
        despi = userdata[0].auction[j].descri;

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

//console.log(na);

//console.log(despi);
data ={
    namei:na,
    amount:amounti,
    min:mini,
    img:img,
    descri:despi,
}
res.render("buyer",{records:data});
})
app.post("/buyer",async(req,res)=>{

  var inti = {
        name:req.body.username,
        amountbidded:req.body.biddprice,
        email:req.body.email
  }
//console.log(na);
const filter ={"bidders.name" : na};
  const productcollection = await User.findOneAndUpdate(filter,{ $push :{"bidders.$.details":inti } },{new:true}
);
<<<<<<< HEAD
  
  res.redirect("/exploreauction");
=======


  res.redirect(`/exploreauction?name=${auctionid}`);
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
     
 })
 //winner

app.get("/winner",isAuth,async(req,res)=>{

    //console.log(req.session.name);

    product = (req.query.myVar1);
    var na = product;

const userdata = await User.find({"bidders.name" : product});

<<<<<<< HEAD
var id1 = userdata[0]._id;
//console.log(id1);
var data,mini,id3,k,id2,username,i;


=======

var id1 = userdata[0]._id;

var data, mini, id3, i, k, id2, username;
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
var size = userdata[0].bidders.length;
//yconsole.log(size);

for( i = 0; i < size ; i ++)
{
  
    if((userdata[0].bidders[i].name)=== na)
    {
      
<<<<<<< HEAD
        id2 = userdata[0].bidders[i]._id;
       
       if(userdata[0].bidders[i].details.length!=0)
       {
=======
        if(userdata[0].bidders[i].details.length!=0)
        {
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
        for(var j = 0 ; j < userdata[0].bidders[i].details.length;j++)
        {
          
                if(userdata[0].bidders[i].details[j].amountbidded > mini)

                {
<<<<<<< HEAD
                       k = j;
                }
        }
        mini = userdata[0].bidders[i].details[j].amountbidded ;
=======
                   
                   
               
                       k = j;
                       
                }
        }
       
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
        id3 = userdata[0].bidders[i].details[k]._id;
       // emailsend = userdata[0].bidders[i].details[k].email;
       mini = userdata[0].bidders[i].details[k].amountbidded ;
        username = userdata[0].bidders[i].details[k].name;
<<<<<<< HEAD
       }
        break;
=======
    }
    break;
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
    }
   
}

<<<<<<< HEAD


=======
if(username==null)
{
    username = "No person auctioned for this product!";
}
>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e
data = {
    namei:username,
    min:mini,
}

<<<<<<< HEAD
if(userdata[0].bidders[i].details.length!=0)
{
if(emailsend!=null){
var mailOptions = {
    from: process.env.fromsecond,
    to: process.env.emailsend,
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
}
=======
// if(emailsend!=null){
// var mailOptions = {
//     from: fromsecond,
//     to: emailsend,
//     subject: 'From eauction',
//     text: 'Congratulations!! you are the winner of auction',
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// const resu = await User.findByIdAndUpdate({_id:id1},
//     {$set :{'bidders.$[f].details.$[s].email':null}},
//     {arrayFilters : [{'f._id':id2},{'s._id':id3}]});
    

// }
// else{
//     console.log('email already sent!!!');
// }

>>>>>>> eef186c4729aa6e1b732d87843ba184adbc8d14e

 res.render("winner",{records:data});

})
app.listen(3000,()=>{
    console.log("server is listening");
});