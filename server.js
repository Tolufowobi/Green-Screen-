// import dependency  modules
var express = require('express');
var app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const mqtt = require('mqtt');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
app.set('sensorURi', 'mqtt://localhost:1883');

const Sensor = require('./models/sensors')
var Reading = require('./models/readings')
const Value = require('./models/values')

//main web client route
const WebClientRoute = require('./routes/routes.webclient/route.webclient');
//Main sensor route-- not configured
const SensorsApiRoute = require('./routes/routes.sensor_api/route.sensor');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/greenscreen');

mongoose.connection.on('connected', function(){
    console.log('Connected to database @ port 27017');
});

mongoose.connection.on('error', function(err){
    console.log('Error: '+ err);
});

//port no
const port = 3000;

//Middleware
//cors
app.use(cors());

app.use(bodyparser.urlencoded({extended: true}));

//bodyparser
app.use(bodyparser.json());

//Declare static directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})

//Routes
//webclient
app.use('/client', WebClientRoute);

//Frontend-Server
io.on('connect', function(socket){
    console.log('Connection established with client: ' +socket.id);
    socket.on('disconnect', function(){
        console.log('Client: '+ socket.client.id + 'has disconnected');
    });
    //Listen for front end sensor state change.
    socket.on('SensorPowerToggled', function(data){
        console.log('Sensor toggle from front end');
        var id = data.id;
        Sensor.findById(id, function(err, res){
            var sensor = res;
            sensor.state = data.state;
            sensor.save();
            var state;
            if(sensor.state === false){
                state = "Off";
            }else{
                state="On";
            }
            //Announce to sensor state change to sensor api
            sensorClient.publish('Insensor', JSON.stringify(state));
        });
    });
    //User changes the reading value
    socket.on('ReadingChanged', function(data){
        console.log("Value change for reading: "+ data.id);
        var id = data.id;
        //retrieve reading from storage and modify
        Reading.findById(id, function(err, res){
            var reading = res;
            res.value = data.value;
            res.save();
        });
        // create new value object based on reading and write to memory
        let newValue = new Value({
            reading_id: data.id,
            value: data.value,
            time_stamp: Date.now()
        });
        newValue.save();
        //Announce reading value to the sensor end.
        sensorClient.publish('Inreading', JSON.stringify(newValue));
        // send the reading value to the front end
        io.emit('NewValue', JSON.stringify(newValue));
    });
});


//Sensor-Server
var sensorClient = mqtt.connect(app.get('sensorURi'));
sensorClient.on('connect', function(){
    sensorClient.subscribe('Outreading')
    sensorClient.subscribe('new connection');
    sensorClient.subscribe('Insensor')
    sensorClient.publish('new connection', 'Connection intitiated');
    console.log('Sensor Api connection established');
    sensorClient.on('message',function(topic,payload){
        if(topic == 'Outreading'){
            console.log('Reading transmission recieved from back end')
            var datastream = payload.toString();
            var data = JSON.parse(datastream);
            var id = data.id
            Reading.findOne({_id: id}, function(err, res){
                if(res){
                    res.value = data.value;
                    //write change to memory
                    Reading.update(res);
                    var val = new Value({
                        reading_id: res.id,
                        value: res.value,
                        time_stamp: Date.now()
                    });
                    val.save();
                    //announce new reading value to front end, send reading and the newly created value object
                    io.emit('ReadingTransmitted', JSON.stringify(res));
                    io.emit('NewValue', JSON.stringify(val));
                }
            });
        }if(topic == "new connection"){
            console.log('End to end communication established with back end')
        }
    });
});


//set the server port on the host machine  
app.set('port',process.env.port || port);
server.listen(3000, function(){
    console.log('Server started at port : '+app.get('port'));
});
