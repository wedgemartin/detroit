

// This should likely become an instance of a parent ApplicationController class
//   akin to Rails.

ExamplesController = function() {
   return this;
}
  

ExamplesController.prototype.index = function() {
   return { "sample": "payload here" };
}

ExamplesController = new ExamplesController();


