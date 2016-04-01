
// Base model.
//  All database driven models should inherit this class.

Base = function(classname) {
   var writer = API.getWriter();
   var mongo = API.getMongo();
   this.collection = mongo.getCollection(classname);
   writer.println(" Got collection... : " + this.collection);
};


Base.prototype.create = function() {
};

Base.prototype.update = function() {
};

Base.prototype.save = function() {
  this.collection.insertOne(org.bson.Document.parse(this.toJSON()));
};



