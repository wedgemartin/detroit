
// Example model.  Should likely inherit from some class
//   that will have the methods for manipulating the database.

Example = function(name) {
   // XXX that the collection associated with this model will be the second arg of Base.call
   Base.call(this, "examples");
   this._name = name;
};


Example.prototype = Object.create(Base.prototype);
Example.prototype.constructor = Example;

Example.prototype.toJSON = function() {
   var jsonObj = new Object();
   jsonObj.name = this.getName();
   jsonObj.timestamp = new Date();
   return JSON.stringify(jsonObj);
}

Example.prototype.getName = function() {
   return this._name;
};



