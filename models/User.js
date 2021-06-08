var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected');
});

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true
    },
    email : {
        type: String,
        required:true,
        unique:true
    },
    password: {
      type: String,
      required:true
    },
    contact:{
      type: String,
      required: true
    },
    status: String
});

// UserSchema.plugin(passportLocalMongoose);
const User= mongoose.model("User", UserSchema);
 
module.exports = User;