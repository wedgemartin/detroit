

// 
// XXX Do not remove include lines.  These are used by detest to import models and other files.
// 
//include js/models/example.js

var example = new Example("testobj");


tester.addTest( "Can instantiate example", function() {
   tester.assertTrue( example !== undefined );
});

tester.addTest( "Can save and reload", function() {
   example.save();
   example.reload();
   tester.assertTrue( example.id !== undefined );
});



