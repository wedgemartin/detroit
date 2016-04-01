
// Base model.
//  All database driven models should inherit this class.

Base = function(classname) {
   var writer = API.getWriter();
   var mongo = API.getMongo();
   this.collection = mongo.getCollection(classname);
};


Base.prototype.create = function() {
};

Base.prototype.update = function() {
};

Base.prototype.save = function() {
  var doc = this.asDocument();
  this.collection.insertOne(doc);
};



