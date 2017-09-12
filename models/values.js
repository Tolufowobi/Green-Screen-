const mongoose = require('mongoose');

const valueSchema = mongoose.Schema({
    reading_id: {type:String, required:true},
    value: {type:Number, required: true},
    time_stamp: {type:Date, required: true}
})

module.exports = mongoose.model('Value', valueSchema);