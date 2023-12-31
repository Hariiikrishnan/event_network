import express from 'express';
import session from "express-session";
import dotenv from "dotenv";
import bodyparser from "body-parser";
import passport from "passport";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import connectDB from './config/db.js'
import {p_uid,upload} from './utils/uploadImage.js';
import uploadToCloudinary from './utils/cloudinaryUpload.js';


import connectCloudinary from './config/cloudinary.js'
import {getAllEvents} from './controllers/eventController.js';
import Event from './models/eventModel.js';
import {registerUser,loginUser} from './controllers/userController.js';
import User from './models/userModel.js';
import Order from './models/orderModel.js';



dotenv.config()
connectDB();
connectCloudinary();
const app = express()
const PORT = process.env.PORT || 5000;


app.use(express.static("public"));
app.set("view engine","ejs");
app.use(cors()); 
app.use(bodyparser.urlencoded({extended:true}));


app.use(express.json());
app.use(passport.initialize());
app.use(session({
    secret:process.env.SECRETKEY ,
    resave:false,
    saveUninitialized:false
  }));
app.use(passport.session());


    

app.get("/",(req,res)=>{
    res.send("Hello");
    console.log("Hi")
})

app.get("/home",(req,res)=>{

  Event.find({}).then((results)=>{
    // res.json({events:results});
    // console.log(results);
    res.render("home",{events:results});
}).catch((err)=>{
    console.log(err);
})

});


app.get("/login",(req,res)=>{
  res.render("login");
})
app.get("/register",(req,res)=>{
  res.render("register");
})

app.get("/events",getAllEvents);
app.get("/admin/:u_id",(req,res)=>{
  User.find({u_id:req.params.u_id}).then((admin)=>{
    res.render("adminPortal",{user:admin});

  })
});
app.get("/adminForm/:u_id",(req,res)=>{
  User.find({u_id:req.params.u_id}).then((admin)=>{
    res.render("adminForm",{user:admin});

  })
});
app.get("/event/:e_id",(req,res)=>{
  Event.find({e_id:req.params.e_id}).then((results)=>{
    res.render("singleEvent",{event:results});
  }).catch((err)=>{
    console.log(err);
  })
});

app.get("/order/:e_id/:p_name",(req,res)=>{
  console.log(req.query.ordered);
  Event.find({e_id:req.params.e_id}).then((results)=>{
   
    res.render("eventOrderForm",{event:results,p_name:req.params.p_name});
  }).catch((err)=>{
    console.log(err);
  })
});

app.get("/orders/:u_id",(req,res)=>{
  User.find({u_id:req.params.u_id}).then((user)=>{

    Order.find({u_id:req.params.u_id}).then((orders)=>{
      res.render("orders",{orders:orders,user:user});
    }).catch((err)=>{
      console.log(err);
    })
  }).catch((error)=>{
    console.log(error);
  })
  })






app.post("/orderAt/:e_id/:u_id",(req,res)=>{
  const order = new Order({
    o_id:uuidv4(),
    e_id:req.params.e_id,
    u_id:req.params.u_id,
    name:req.body.name,
    date:req.body.orderDate,
    phNo:req.body.phNo,
  })

  order.save().then((saved)=>{
   res.redirect("/home");
  }).catch((err)=>{
    console.log(err);
  })
});



app.post("/loginAt",loginUser);
app.post("/registerAt",registerUser);


app.post("/addEvent/:u_id",upload.single("ref_image"),async(req,res)=>{

  // console.log("enna")
  // console.log(req.file);
  console.log("start");

  var locaFilePath = req.file.path
  var result = await uploadToCloudinary(locaFilePath);

  console.log(result);

    const event = new Event({
      e_id:p_uid,
      planner_name:req.body.planner_name,
      name:req.body.event_name,
      plan:req.body.planType,
      u_id:req.params.u_id,
      veg_price:req.body.veg_price,
      non_veg_price:req.body.non_veg_price,
      img_url:result.url,
    });
  

    event.save().then((result)=>{
      // Event.find
      // console.log(results);
     res.redirect("/admin/"+req.params.u_id);
    }).catch((err)=>{
      console.log(err);
    });
  });

  app.post("/search",(req,res)=>{
    // console.log(req.body.eventType);
    var query;
    if(req.body.eventType==='' && req.body.planType===''){
      console.log('empty');
      query = {};
    }
    else if(req.body.eventType===''){
      query = {
        plan:req.body.planType,
      }
    }
    else if(req.body.planType===''){
      query = {
        name:req.body.eventType,
      }
    }else{
      query = {
        
        name:req.body.eventType,
        plan:req.body.planType,
      }
    }

    console.log(query);
    Event.find(query).then((results)=>{
      console.log(results);
      res.render("home",{events:results})
    }).catch((err)=>{
      console.log(err);
    })
  })


app.listen(PORT, function(req,res) {
    console.log("Server is running on Port: " + PORT);
  });
  