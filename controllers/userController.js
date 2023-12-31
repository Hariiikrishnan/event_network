import express from 'express';
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import bodyparser from "body-parser";
import passport from "passport";

import Event from '../models/eventModel.js';


const app = express();
app.use(bodyparser.urlencoded({ extended: true }));



const registerUser = asyncHandler(async(req,res)=>{



    User.register(
        { u_id: uuidv4(), username: req.body.username,email:req.body.email,
          },
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
          } else {
           
            passport.authenticate("local")(req, res, function () {
     
              jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
      
                User.findOne({ username: req.body.username }).then((result)=>{
                
                  console.log(result);
                  if(result.isAdmin){
                    console.log("Yes Admin");
                    res.redirect('/admin/'+result.u_id);
                  }else{
                    console.log("No Its User");

                    res.redirect("home");
                  }

                  
                }).catch((err)=>{
                  console.log(err);
                }); 
              
              });
            });
          }
        }
      );
});


const loginUser = asyncHandler(async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
      username: username,
      password: password,
    });

    // console.log(user);
  
    req.login(user, function (err) {
      if (err) {
        console.log(err);
        
        res.render("login",{status:500})
        return;
      } else {
        passport.authenticate("local")(req, res, function () {
            

            jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
              // console.log(token);
              User.findOne({ username: username }).then((result)=>{
                
                console.log(result);
                if(result.isAdmin){
                  res.redirect('/admin/'+result.u_id);
                }else{
                  res.redirect("home");
                }

                // console.log(result);
                
                
                
              }).catch((err)=>{
                console.log(err);
              }); 
              
            });
          });
        }
      });
  
    })
    
export {registerUser,loginUser};