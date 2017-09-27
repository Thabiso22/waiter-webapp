const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/waiterdatabase";
console.log(mongoURL);
mongoose.connect(mongoURL,function(err, result) {
  if (err) {
    console.log(err);
  }else {
    console.log("Connected to waiterdatabase.");
  }
});


var UserSchema = mongoose.Schema({
    name: String,
    monday: Boolean,
    tuesday:Boolean,
    wednesday:Boolean,
    thursday:Boolean,
    friday:Boolean

   });



var user = mongoose.model('waiterdatabase', UserSchema);
module.exports = user;
