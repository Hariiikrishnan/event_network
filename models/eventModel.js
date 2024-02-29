import mongoose from 'mongoose';


const eventSchema = new mongoose.Schema({
    e_id:String,
    name:String,
    // isVeg:Boolean,
    veg_price:String,
    planner_name:String,
    u_id:String,
    non_veg_price:String,
    hallSize:String,
    plan:String,
    img_url:String,
  });



  const Event = new mongoose.model("Event",eventSchema);

  export default Event