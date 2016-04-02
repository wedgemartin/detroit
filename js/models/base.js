
// Base model.
//  All database driven models should inherit this class.

Base = function(classname) {
   var writer = API.getWriter();
   var mongo = API.getMongo();
   this.collection = mongo.getCollection(classname);
};


Base.prototype.find = function(query) {
  var docs = new Array();
  writer = API.getWriter();
  if ( query ) {
     var iterable = this.collection.find(query);
  } else {
     var iterable = this.collection.find().iterator();
     while ( iterable.hasNext() ) {
         docs.push(iterable.next().toJson());
     }
  }
  return docs;
}

Base.prototype.create = function() {
};

Base.prototype.update = function() {
};

Base.prototype.save = function() {
  var doc = this.asDocument();
  this.collection.insertOne(doc);
};



