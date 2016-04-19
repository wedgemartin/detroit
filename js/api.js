
//  Main DetroitAPI methods for handling requests and passing them to controller methods.

APIRouter = function() {
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

DetroitAPI.prototype.setRequest = function(r) {
   this._request = r;
}

DetroitAPI.prototype.getRequest = function() {
   return this._request;
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

function detroit_init(mongo, out) {
   // Do initializationy stuff here..
   out.println("Initializing detroit...");
   API.setMongo(mongo);
   API.setWriter(out);
}

function handleRequest(request, response, writer, command, post_data) {
   API.setRequest(request);
   var param_hash = {};
   var post_data_type = undefined;
   var uri = request.getRequestURI();
   var params = request.getQueryString();
   if ( command == "POST" && post_data ) {
      try {
         post_data = JSON.parse(post_data);
         post_data_type = 'json';
      } catch(err) {
         // Not JSON data, or is broken JSON...
         //  Maybe they're standard params.
         try { 
            post_params = API.parseParams(post_data);
            for ( var param in post_params ) {
               param_hash[param] = post_params[param];
            }
            post_data = undefined; // Dont need to set this field then..
         } catch(err2) {
            // Just raw data...   Encode it so we can safely pass it off to the eval.
            post_data = atob(params);
            post_data_type = "base64data";
         }
      }
   } else {
      param_hash = API.parseParams(params);
   }
   var routes = API.getRouter().listRoutes();
   if ( param_hash['debug'] ) {
      writer.println("  URI: " + uri);
      writer.println("  Params: " + JSON.stringify(param_hash));
      if ( post_data ) {
         writer.println("  Post data: " + post_data);
      }
      writer.println("  API: " + API);
      writer.println("  Router: " + API.getRouter());
      writer.println("  Routes are: " + JSON.stringify(Object.keys(routes)));
   }
   // Now use the Router to handle passing the request off to the correct controller and method.
   if ( param_hash['debug'] ) {
      writer.println("  Checking routes..");
   }
   var out = response.getWriter();
   for ( var route in routes ) {
      var controller = undefined;
      var regexp = new RegExp(route);
      var matches = regexp.exec(uri);
      if ( matches ) {
         if ( typeof routes[route] == "object" && routes[route].length > 1 ) {
            for ( var i = 0; i < routes[route].length; i++ ) { 
               if ( routes[route][i]['command'] == command ) {
                  if ( param_hash['debug'] ) {
                     writer.println("  Have a match: Executing: " + routes[route][i]['method'] + "(" + JSON.stringify(param_hash) + ")\n");
                  }
                  if ( routes[route][i]['param_labels'] ) {
                      for ( var i = 0; i < matches.length; i++ ) {
                           param_hash[routes[route][i]['param_labels'][i]] = matches[i + 1];
                      }
                  }
                  if ( post_data ) {
                      param_hash['post_data'] = post_data;
                      param_hash['post_data_type'] = post_data_type;
                  }
                  var data = eval(routes[route][i]['method'] + "(" + JSON.stringify(param_hash) + ");");
                  out.println(data.toString());
               }
            }
         } else {
            if ( param_hash['debug'] ) {
               writer.println("  Have a match: Executing: " + routes[route]['method'] + "(" + JSON.stringify(param_hash) + ")\n");
            }
            if ( routes[route]['param_labels'] ) {
               for ( var i = 0; i < matches.length; i++ ) {
                  param_hash[routes[route]['param_labels'][i]] = matches[i + 1];
               }
            }
            if ( post_data ) {
                param_hash['post_data'] = post_data;
                param_hash['post_data_type'] = post_data_type;
            }
            var data = eval(routes[route]['method'] + "(" + JSON.stringify(param_hash) + ");");
            out.println(data.toString());
         }
      }
   }
} 




