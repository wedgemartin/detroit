
// Note that the keys for the routes hash below are parsed by regular expressions
//  and executed sequentially.  Be sure that your path is unique.

routes = {
  "/examples": { command: "GET", method: "ExamplesController.index" },
  "/example_two/(.*)": { command: "POST", method: "ExamplesController.index", param_labels: [ 'something_else' ] },
  "/example": { command: "POST", method: "ExamplesController.create" }
}
