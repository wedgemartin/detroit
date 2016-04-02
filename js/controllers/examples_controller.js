

// This should likely become an instance of a parent ApplicationController class
//   akin to Rails.

ExamplesController = function() {
   return this;
}

ExamplesController.prototype.index = function(params) {
   var results = new Example().find();
   return results.toString();
}

ExamplesController.prototype.create = function(params) {
   var example = undefined;
   var mongo = API.getMongo();
   var writer = API.getWriter();
   if ( params['name'] ) {
      example = new Example(params['name']);
      example.save();
   }
   return example.toJSON();
}


ExamplesController = new ExamplesController();


