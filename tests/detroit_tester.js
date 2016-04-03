

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
  this._tests = new Array();
}



DetroitTester.prototype.addTest = function(label, fref) {
   this._tests.push([ label, fref ]);
}


DetroitTester.prototype.runTests = function() {
   for ( var test in this._tests ) {
      var label = this._tests[test][0];
      var fref = this._tests[test][1];
      try {
         var result = fref();
      } catch(err) {
         if ( err == true ) {
            this._passed.push( { label: label } );
            API.getWriter().println("[32;1m" + label + ": Passed[0m");
         } else {
            API.getWriter().println("[31;1m" + label + ": FAILED[0m");
            this._failed.push({ label: label, error: err } );
         }
      }
   }
}

DetroitTester.prototype.assertEqual = function(left, right) {
   if ( left == right ) {
      throw true;
   } else {
      throw false;
   }
}

DetroitTester.prototype.assertTrue = function(condition) {
   if ( condition == true ) {
      throw true;
   } else {
      throw false;
   }
}

DetroitTester.prototype.printSummary = function() {
   API.getWriter().println("Printing summary:");
   API.getWriter().println("   Passed; [32;1m" + this._passed.length + "[0m");
   API.getWriter().println("   Failed: [31;1m" + this._failed.length + "[0m");
   for ( var failure in this._failed ) {
      API.getWriter().println("       " + this._failed[failure]['label'] + " - failed with message: " + this._failed[failure]['error']);
   }
   API.getWriter().println("");

}


API.getWriter().println("DetroitTester: Initializing tester...");
tester = new DetroitTester();
