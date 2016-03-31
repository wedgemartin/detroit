
// Note that the keys for the routes hash below are parsed by regular expressions
//  and executed sequentially.  Be sure that your path is unique.

routes = {
  "/examples/(.*)": { method: "ExamplesController.index", param_labels: [ 'something' ] },
  "/example_two/(.*)": { method: "ExamplesController.index", param_labels: [ 'something_else' ] }
}
