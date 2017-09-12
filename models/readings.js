const mongoose = require('mongoose');

const readingSchema =  mongoose.Schema({
    sensor_id: {type:String, required:true},
    name: {type:String, required:true},
    description: {type:String, required:false},
    value: {type:Number, required:true},
    unit: {type:String, required: false},
    tag: {type: Array, required: false}
});

module.exports = mongoose.model('Reading', readingSchema);