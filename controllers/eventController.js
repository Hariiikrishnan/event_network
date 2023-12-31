import express from "express";

import Event from '../models/eventModel.js';
import User from "../models/userModel.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

import asyncHandler from "express-async-handler";
import bodyparser from "body-parser";
import { v4 as uuidv4 } from "uuid";


const app = express();
app.use(bodyparser.urlencoded({ extended: true }));


const getAllEvents = asyncHandler(async(req,res)=>{
    console.log("events");

    Event.find({}).then((results)=>{
        res.json({events:results});
    }).catch((err)=>{
        console.log(err);
    })
})


export {getAllEvents };