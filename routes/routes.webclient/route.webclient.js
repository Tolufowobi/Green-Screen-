const express = require('express');
//create a sub-app
const ClientRouter = express.Router();

//import subroutes;

const usersroute = require('./routes.subroutes/route.users');
const sheltersroute = require('./routes.subroutes/route.shelters');
const sensorsroute = require('./routes.subroutes/route.sensors');
const readingsroute = require('./routes.subroutes/route.readings');

console.log('configuring client subroutines');
//configure subroutes
ClientRouter.use('/users', usersroute);
ClientRouter.use('/shelters', sheltersroute);
ClientRouter.use('/sensors', sensorsroute);
ClientRouter.use('/readings', readingsroute);

module.exports = ClientRouter;