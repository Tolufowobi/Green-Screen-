const express = require('express');
const UsersRouter = express.Router();

const User = require('../../../models/users');

//configure verbs
console.log('configuring verbs at users subroute');
//get all users
UsersRouter.get('', function(req, res, next){
    User.find(function(err, users){
        if(err){
            return res.json(err);
        }else{
            return res.json(users);
        }
    });
});

//get/ authenticate a specific user
UsersRouter.post('/auth', function(req, res,next){
    console.log('Request: '+ req.body.toString());
     User.find({username: req.body.username, password: req.body.password})
    .limit(1)
    .exec(function(err, user){
        if(err){
            res.json(err)
        }else{
             res.json(user[0]); 
             console.log(user[0]);  
        }
    });
});

//add a user
UsersRouter.post('/add', function(req, res, next){
    var userparam = req.body.user;
    let userschema = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        address: req.body.address,
        username: req.body.username,
        password: req.body.password
    });
    userschema.save(function(err){
        if(err){
            res.json('Error: Failed to add user');
        }else{
            res.json('true');
        }
    });
});

//edit user info
UsersRouter.put('/update', function(req, res, next){
    var id = req.body.id;
    User.findById(id, function(err, user){
        if(err){
            res.json(err);
        }else{
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.phone = req.body.phone;
            user.username = req.body.email;
            user.password = req.body.password;
            user.save(function(err){
                res.json(res.json() + res.json(err));
            })
        }
    });
});

//delete a user 
UsersRouter.delete('/delete/:id', function(req, res, next){
    var userId = req.params.id;
    User.remove(userId, function(err){
        if(err){
            res.json(err);
        }else{
            res.json('true');
        }
    });
});

module.exports = UsersRouter;