const express = require('express');
const ReadingsRouter = express.Router();

const Reading = require('../../../models/readings');
const Value = require('../../../models/values');

//configure verbs
console.log('configuring verbs at readings subroute');
//get all the readings
ReadingsRouter.get('', function(req, res, next){
    Reading.find(function(err, readings){
        if(err){
            res.json(err);
        }else{
            res.json(readings);
        }
    });
});

//get readings for a specified sensor
ReadingsRouter.get('/sensorreadings/:sensorId', function(req, res, next){
    var sensorId = req.params['sensorId']
    Reading.find({sensor_id: sensorId}, function(err, readings){
        if(err){
            res.json(err);
        }else{
            res.json({"Readings":readings});
        }
    });
});

ReadingsRouter.get('/readingvalues/:readingId', function(req, res, next){
    var readingId = req.params['readingId']
    Value.find({reading_id: readingId}, function(err, values){
        if(err){
            res.json(err);
        }else{
            res.json({"Values":values});
        }
    });
});

//add a new reading
ReadingsRouter.post('/add', function(req, res, next){
    let reading = new Reading({
        name: req.body.name,
        description: req.body.description,
        value: req.body.value,
        unit: req.body.unit,
        sensor_id: req.body.sensorid
    });
    reading.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json(reading);
        }
    })
});

//update a reading
ReadingsRouter.put('/update', function(req, res,next){
    var id = req.body.id;
    Reading.findById(id, function(err, reading){
        if(err){
            res.json(err);
        }else{
            reading.name = req.body.description;
            reading.description = req.body.description;
            reading.value = req.body.value;
            reading.unit = req.body.unit;
            reading.tag = req.body.tag;
        }
    });
});

//delete a readng
ReadingsRouter.delete('/delete/:id', function(req, res, next){
var id = req.params['id'];
Reading.remove({_id:id}, function(err){
        if(err){
            return res.json(err);
        }else{
            return res.json(['true']);
        }
    });
});

module.exports = ReadingsRouter;