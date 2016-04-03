

// 
// XXX Do not remove include lines.  These are used by detest to import models and other files.
// 
//include js/models/example.js
//include js/controllers/examples_controller.js


tester.addTest( "Can return index", function() {
   var array = ExamplesController.index();
   tester.assertTrue( typeof array == "string" );
});



