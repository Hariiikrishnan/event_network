import mongoose from 'mongoose';


const orderSchema = new mongoose.Schema({
    o_id:String,
    e_id:String,
    u_id:String,
    date:String,
    name:String,
    phNo:Number,
  });



  const Order = new mongoose.model("Order",orderSchema);

  export default Order