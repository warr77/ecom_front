const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const schema =  mongoose.Schema(
    {
name:{
    type:String,
    required: true,
    maxlength: 32

},
messages: [{
    text: { 
      type: String,
      max: 500
    },
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'users'
    },
    time: Date

  }],


    })
    module.exports=mongoose.model("groups",schema);