

// Load MongoDB handle so that it can be used elsewhere.

var mc = new com.mongodb.MongoClient("localhost", 27017);
var mongo = mc.getDatabase("detroit_test");

// Obviously, API will have to have been loaded...
API.setMongo(mongo);
API.setWriter(java.lang.System.out);


DetroitTester = function() {
  this._passed = [];
  this._failed = [];
}


DetroitTester.prototype.test = function(label, fref) {
   try {
      (fref)();
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
   API.getWriter().println("Failed; " + this._failed.length);
   API.getWriter().println("Passed; " + this._passed.length);

}


tester = new DetroitTester();
