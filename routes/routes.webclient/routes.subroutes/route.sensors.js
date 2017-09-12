const express = require('express');
const SensorsRouter = express.Router();

const Sensor = require('../../../models/sensors');

//configure verbs
console.log('configuring verbs at sensors subroute');
//get all sensors
SensorsRouter.get('', function(req, res, next){
    Sensor.find(function(err, sensors){
        if(err){
            res.json(err);
        }else{
            res.json(sensors);
        }
    });
});

//get sensors for a shelter
SensorsRouter.get('/sheltersensors/:greenhouseId', function(req, res,next){
    var greenhouseId = req.params['greenhouseId'];
    Sensor.find({shelter_id: greenhouseId}, function(err, sensors){
        if(err){
            res.json(err);
        }else{
            res.json({"Sensors":sensors});
        }
    });
});

//add a sensor
SensorsRouter.post('/add', function(req, res, next){
    let newSensor = new Sensor({
        name: req.body.name,
        description: req.body.description,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        serialNo: req.body.serialNo,
        shelter_id: req.body.shelterid,
        state: req.body.state
    });
    newSensor.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json(newSensor);
        }
    });
});

//update a sensor
SensorsRouter.put('/update', function(req, res, next){
    Sensor.findById(editsensor.id, function(err, sensor){
        if(err){
            res.json(err);
        }else{
            sensor.name = req.body.name;
            sensor.descripton = req.body.descripton;
            sensor.tag = req.body.tag;
            sensor.save(function(err){
                if(err){
                    res.json(err);
                }else{
                    res.json(sensor);
                }
            });
        }
    });
});

//delete sensor
SensorsRouter.delete('/delete/:sensorId', function(req, res, next){
    var sensorid = res.params['sensorId'];
    Sensor.remove(sensorid, function(err){
        if(err){
            res.json(err);
        }else{
            res.json(['true']);
        }
    });
});

module.exports = SensorsRouter;