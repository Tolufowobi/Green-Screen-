const mongoose = require('mongoose');

const shelterSchema =  mongoose.Schema({
user_id:{type:String, required:true},
name: {type:String, required:true},
description: {type:String, required:false},
location: {type: String, required:false}
});

module.exports = mongoose.model('Shelter', shelterSchema);