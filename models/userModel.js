import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportlocalmongoose from "passport-local-mongoose";
import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config()
const userschema = new mongoose.Schema({
  u_id: String,
  username: String,
  password: String,
  email:String,
  isAdmin:Boolean,
});
userschema.plugin(passportlocalmongoose);

const User = new mongoose.model("User", userschema);

passport.use(User.createStrategy());


passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    return done(null, await User.findById(id));
  } catch(error) {
    return done(error);
  } 
});


app.use(
  session({
    secret: process.env.SECRETKEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

export default User;
