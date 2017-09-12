const express = require('express');
const SheltersRouter = express.Router();

const Shelter = require('../../../models/shelters');

//configure verbs
console.log('configuring verbs at shelters subroute');
//get all shouters
SheltersRouter.get('', function(req, res, next){
    Shelter.find(function(err, shelters){
        if(err){
            res.json(err);
        }else{
            res.json(shelters);
        }
    });
});

// get the shelters for user
SheltersRouter.get('/usershelters/:userId', function(req, res, next){
    var userid = req.params['userId'];
    Shelter.find({user_id: userid}, function(err, shelters){
        if(err){
            res.json(err);
        }else{
            res.json({"Shelters":shelters});
        }
    });
});

//add a shelter
SheltersRouter.post('/add', function(req, res, next){
    console.log('Request: '+ req.body);
     let newShelter = new Shelter({
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        user_id: req.body.userid
    });
    newShelter.save(function(err){
        if(err){
            res.json(err);
        }
        else{
            res.json(newShelter);
        }
    }); 
});

// update a shelters information
SheltersRouter.put('/update', function(req, res, next){
    var id = req.body.id;
    Shelter.find({_id: id}, function(err, shelter){
        if(err){
            res.json(err);
        }else{
            shelter.name = req.body.name;
            shelter.description = req.body.description;
            shelter.location = req.body.location;
            shelter.save(function(err){
                if(err){
                    res.json(err);
                }else{
                    res.json(shelter);
                }
            });

        }
    });
});

//delete a shelter
SheltersRouter.delete('/delete/:id', function(req, res, next){
    var shelterId = req.params['id'];
    Shelter.remove(shelterId, function(err){
        if(err){
            res.json(err);
        }else{
            res.json('true');
        }
    })
});

module.exports = SheltersRouter;