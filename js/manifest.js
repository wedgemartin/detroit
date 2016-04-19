load("js/routes.js")
load("js/api.js")
load("js/models/base.js");

var mc = new com.mongodb.MongoClient("localhost", 27017);
var mongo = mc.getDatabase("detroit");
API.setMongo(mongo);



