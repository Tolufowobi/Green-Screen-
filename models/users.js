const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: {type:String, required: true },
    last_name: {type:String, required: true},
    phone: {type:String, required: false},
    address: {type:String, required:false},
    username: {type:String, required:true, unique: true},
    password: {type:String, required:true},
}); 

module.exports = mongoose.model("User", UserSchema);