

// Load MongoDB handle so that it can be used elsewhere.

var mc = new com.mongodb.MongoClient("localhost", 27017);
var mongo = mc.getDatabase("detroit_test");

// Obviously, API will have to have been loaded...
API.setMongo(mongo);
API.setWriter(java.lang.System.out);

API.getWriter().println("DetroitTester: Beginning tests...");


DetroitTester = function() {
  this._passed = new Array();
  this._failed = new Array();
}


DetroitTester.prototype.test = function(label, fref) {
   API.getWriter().print(label);
   try {
      var result = (fref)();
      if ( result ) {
        this._passed.push( { label: label, error: err } );
        API.getWriter().println(" passed");
      } else {
        this._failed.push( { label: label } );
        API.getWriter().println(" FAILED");
      } 
   } catch(err) {
      API.getWriter().println(label + " FAILED");
      this._failed.push({ label: label, error: err } );
   }
}

DetroitTester.prototype.assertEqual = function(left, right) {
   if ( left == right ) {
      return true;
   } else {
      return false;
   }
}

DetroitTester.prototype.assertTrue = function(condition) {
   if ( condition == true ) {
      return true;
   } else {
      return false;
   }
}

DetroitTester.prototype.printSummary = function() {
   API.getWriter().println("Printing summary:");
   API.getWriter().println("   Passed; " + this._passed.length);
   API.getWriter().println("   Failed; " + this._failed.length);
   for ( var failure in this._failed ) {
      API.getWriter().println("       " + this._failed[failure]['label'] + " - failed with message: " + this._failed[failure]['error']);
   }

}


API.getWriter().println("DetroitTester: Initializing tester...");
tester = new DetroitTester();
