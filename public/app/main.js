var load = require('./load.js');
var domready = require("domready");

domready(function () {
  console.log('domready!');
  load.excitingFormElements();
  load.parsleyCustomValidators();
  load.parsleyValidationActions();
});
