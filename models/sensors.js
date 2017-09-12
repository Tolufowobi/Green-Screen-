const mongoose = require('mongoose');

const sensorSchema =  mongoose.Schema({
shelter_id: {type: String, required:true},
name: {type:String, required:true},
description: {type:String, required:false},
manufacturer: {type:String, required:false},
model: {type:String, required: false},
serialNo: {type: String, required:false},
state:{type:Boolean, required: true}
});

module.exports = mongoose.model('Sensor', sensorSchema);