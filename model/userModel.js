
const mongoose=require('mongoose');
 
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userImageUrl:{
        type: String,
        required:false,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
});
 
const User=mongoose.model('users',userSchema);
 
module.exports=User;