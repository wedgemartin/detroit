
// Base model.
//  All database driven models should inherit this class.

Base = function(classname) {
   var mongo = API.getMongo();
   this.collection = mongo.getCollection(classname);
};


Base.prototype.find = function(query) {
  var docs = new Array();
  writer = API.getWriter();
  if ( query ) {
     var iterable = this.collection.find(query).iterator();
     while ( iterable.hasNext() ) {
         docs.push(iterable.next().toJson());
     }
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
   if ( ( typeof this.getId == "function" && this.getId() ) || this._id ) {
      var this_id = undefined;
      if ( typeof this.getId == "function" ) { 
         this_id = this.getId();
      } else {
         this_id = this._id;
      }
      var resultObj = this.collection.updateOne( new org.bson.Document("_id", this_id), new org.bson.Document("$set", doc), (new com.mongodb.client.model.UpdateOptions()).upsert(true));
      if ( resultObj.getUpsertedId() ) {
         this._id = resultObj.getUpsertedId();
      }
   } else {
      var resultObj = this.collection.updateOne( doc , new org.bson.Document("$set", doc), (new com.mongodb.client.model.UpdateOptions()).upsert(true));
      if ( resultObj.getUpsertedId() ) {
         this._id = resultObj.getUpsertedId();
      }
   }
};



