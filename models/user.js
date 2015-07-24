var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	salt = bcrypt.genSaltSync(10),
	Goal = require('./goal');
	// uniqueValidator = require('mongoose-unique-validator');

//set User Schema

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		required: true
		// index: {
		// 	unique: true
		// }
	},
	passwordDigest: {type: String, required: true, minlength: 6},
	goals: [Goal.schema],
});

//create a new user with secure hashed password
UserSchema.statics.createSecure = function(userData, callback){
	//'this' references the schema
	// stored into another variable since the context will change in nested callbacks
	var that = this;

	//hash password user enters at sign up
	bcrypt.genSalt(function (err,salt){
		bcrypt.hash(userData.password, salt, function(err,hash){
			console.log(hash);

			//create the new user (save to db) with hashed password
			that.create({
				firstName: userData.firstName,
				lastName: userData.lastName,
				email: userData.email,
				passwordDigest: hash
			}, callback);
		});
	});
};

//authenticate user at login
UserSchema.statics.authenticate = function(email, password, callback){
	//find user by email entered at log in
	this.findOne({email: email}, function(err,user){
		console.log(user);

		//error if no user found
		if (user === null){
			return callback (user=null);

		// if found user, check if pw is correct
		} else if (user.checkPassword(password)) {
			callback(null, user);
		}
	});
};

//compare password user enters with hashed password
UserSchema.methods.checkPassword = function (password){
	//run hashing algorithm (with salt) on password user enters in order to compare with 'passwordDigest'
	return bcrypt.compareSync(password, this.passwordDigest);
};

//create User Model

var User = mongoose.model('User', UserSchema);
// UserSchema.plugin(uniqueValidator);

module.exports = User;

// User.schema.path('email').validate(function (value, respond) {                                                                                           
//     User.findOne({ email: value }, function (err, user) {                                                                                                
//         if(user) respond(false);                                                                                                                         
//     });                                                                                                                                                  
// }, 'This email address is already registered');


