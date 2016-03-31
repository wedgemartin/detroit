
//  Main DetroitAPI methods for handling requests and passing them to controller methods.

APIRouter = function() {
  // var futils = new org.apache.commons.io.FileUtils();
  // var file = new java.io.File("js/routes.js");
  // this._routes = eval(futils.readFileToString(file, "UTF-8"));
  this._routes = routes;
  return this;
}

APIRouter.prototype.listRoutes = function() {
  return this._routes;
}

DetroitAPI = function() {
   this._router = new APIRouter();
   return this;
}

DetroitAPI.prototype.getRouter = function() {
   return this._router;
}

DetroitAPI.prototype.getMongo = function() {
   return this._mongo; 
}

DetroitAPI.prototype.setMongo = function(mongo) {
   this._mongo = mongo; 
}

DetroitAPI.prototype.setWriter = function(w) {
   this._writer = w; 
}

DetroitAPI.prototype.getWriter = function() {
   return this._writer;
}

DetroitAPI.prototype.parseParams = function(params) {
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = params;
    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);
    return hashParams;
}


API = new DetroitAPI();

function detroit_init(mongo) {
   // Do initializationy stuff here..
   API.setMongo(mongo);
}

function handleRequest(uri, params, writer) {
   API.setWriter(writer);
   var param_hash = API.parseParams(params);
   var routes = API.getRouter().listRoutes();
   if ( param_hash['debug'] ) {
      writer.println("  URI: " + uri);
      writer.println("  Params: " + JSON.stringify(param_hash));
      writer.println("  API: " + API);
      writer.println("  Router: " + API.getRouter());
      writer.println("  Routes are: " + JSON.stringify(Object.keys(routes)));
   }
   // Now use the Router to handle passing the request off to the correct controller and method.
   if ( param_hash['debug'] ) {
      writer.println("  Checking routes..");
   }
   for ( var route in routes ) {
      var controller = undefined;
      var regexp = new RegExp(route);
      var matches = regexp.exec(uri);
      if ( matches ) {  // We have a matching route. Check will contain params if they are specified.
         if ( param_hash['debug'] ) {
            writer.println("  Have a match: Executing: " + routes[route]['method'] + "(" + JSON.stringify(param_hash) + ")\n");
         }
         for ( var i = 0; i < matches.length; i++ ) {
            param_hash[routes[route]['param_labels'][i]] = matches[i + 1];
         }
         var output = eval(routes[route]['method'] + "(" + JSON.stringify(param_hash) + ");");
         writer.println(JSON.stringify(output));
      }
   }
}





