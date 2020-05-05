'use strict';

const serviceStylus = require('./controllers/services')

module.exports.createService = serviceStylus.create;
module.exports.deleteService = serviceStylus.deleteService;
module.exports.getService = serviceStylus.get;
module.exports.listService = serviceStylus.list;
module.exports.updateService = serviceStylus.update;
