var express = require('express');
const Io = require('../server');
const Sensor = require('../models/sensors');
const Reading = require('../models/readings');
const Values = require('../models/values');

const socketManager = function(socket){
    console.log('Connection established with client: ' +socket.client.id);
    socket.on('disconnect', function(){
        console.log('Client: '+ socket.client.id + 'has disconnected');
    });
    //Listen for front end sensor state change.
    socket.on('SensorPowerToggled', function(data){
        console.log('Sensor toggle from sensor' + data.id + ". Sensor is on: " + data.isOn)
        var id = data.id;
        Sensor.findById(id, function(err, res){
            var sensor = res;
            res.isON = data.isOn;
            res.save();
        });
        //Announce to sensor state change to sensor api
        io.emit('ToggleSensorPower', {SensorId: id, state:data.isON});
    });
    //User changes the reading value
    socket.on('ReadingChanged', function(data){
        console.log("Value change for reading: " + data.id +". value: " + data.value);
        var id = data.id;
        //retrieve reading from storage and modify
        Reading.findById(id, function(err, res){
            var reading = res;
            res.value = data.value;
            res.save();
        });
        // create new value object based on reading and write to memory
        var value = new Values({
            reading_id: data.id,
            value: data.value,
            time_stamp: Date.now()
        });
        value.save();
        //Announce reading value to the sensor end.
        Io.emit('ChangeReading', {readingId: id, value:data.value});
        // send the reading value to the front end
        Io.emit('NewValue', {data: value});
    });
    //When sensor transmits reading
    socket.on('TransmitReading', function(data){
        var id = data.id
        Reading.findById(id, function(err, res){
            res.value = data.value;
            //write change to memory
            var val = new Values({
                reading_id: res.id,
                value: res.value,
                time_stamp: Date.now()
            });
            val.save();
            //announce new reading value to front end, send reading and the newly created value object
            Io.emit('ReadingTransmitted', {data: res});
            Io.emit('NewValue', {data:val});
        });
    });
}

module.exports = socketManager;
