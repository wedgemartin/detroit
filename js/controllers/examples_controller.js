

// This should likely become an instance of a parent ApplicationController class
//   akin to Rails.

ExamplesController = function() {
   return this;
}

ExamplesController.prototype.index = function(params) {
   return params;
}

ExamplesController.prototype.create = function(params) {
   var example = undefined;
   var mongo = API.getMongo();
   var writer = API.getWriter();
   // writer.println("  MONGO: " + JSON.stringify(mongo));
   if ( params['name'] ) {
      example = new Example(params['name']);
      example.save();
   }
   return example;
}


ExamplesController = new ExamplesController();


