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

  const username = req.body.username;
    const password = req.body.password;
    const rePassword = req.body.rePassword;
    const email = req.body.email;
    const user = new User({
      username: username,
      password: password,
      
    });
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if( email.match(emailFormat) || (username!=="" || password !=="" || rePassword!=="" || email!=="") || (rePassword!==password)){
      res.render("error");
    }else{

      User.register(
        { u_id: uuidv4(), username: req.body.username,
          email:req.body.email,
          // isAdmin:true,
          // isManager:true,
          },
          
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            // res.sendStatus(500);
            res.render("error");
            return;
          } else {
           
            passport.authenticate("local")(req, res, function () {
     
              jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
                
                User.findOne({ username: req.body.username }).then((result)=>{
                
                  console.log(result);
                  if(result.isManager){
                    console.log("Yes Manager");
                    res.redirect('/manager/'+result.u_id);
                  }
                  else if(result.isAdmin){
                    res.redirect('/admin/'+result.u_id);
                  }
                  else{
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
      }
});


const loginUser = asyncHandler(async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = new User({
      username: username,
      password: password,
    });

    if( username === "" || password === ""){
      console.log("here");
      res.render("error");
    }else{

      req.login(user, function (err) {
        if (err) {
          console.log(err);
        
        // console.log(res.statusCode);
        res.render("login",{status:500});
        return;
      } else {
        passport.authenticate("local")(req, res, function () {
           
          
          jwt.sign({ user }, process.env.SECRETKEY, (err, token) => {
            // console.log(token);
            User.findOne({ username: username }).then((result)=>{
              
              console.log(result);
              if(result.isManager){
                res.redirect('/manager/'+result.u_id);
              }
              else if(result.isAdmin){
                res.redirect('/admin/'+result.u_id);
              }
                else if(res.statusCode === 400){
                  res.render("error");
                }
                else{
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
    }
  
    })
    
export {registerUser,loginUser};