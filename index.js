//server side JS

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    ejs = require('ejs'),
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10),
    session = require('express-session');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

//mongoose/models

var mongoose = require('mongoose');
var Goal = require ('./models/goal');
var User = require('./models/user');

mongoose.connect(
  process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/workout' // plug in the db name you've been using
);
// mongoose.connect('mongodb://localhost/workout');


//set view engine for server-side templating
app.set('view engine', 'ejs');

//middleware - set session options

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: 'SuperSecretCookie',
	cookie: { maxAge: 60000 }
}));

//middleware to manage sessions

app.use('/', function(req,res, next){
	//saves userId in session for logged in user
	req.login = function (user){
		req.session.userId = user.id;
	};

	//finds user currently logged in based on 'session.userId'
	req.currentUser = function (callback) {
		User.findOne({_id: req.session.userId}, function(err,user){
			req.user = user;
			callback(null, user);
		});
	};

	//destroy 'session.userId' to log out user
	req.logout = function(){
		req.session.userId = null;
		req.user = null;
	};

	next();
})

//info

app.get('/', function (req, res) {
	console.log(req.session.userId);
	res.sendFile(__dirname + '/public/views/index.html');
});

//user profile page

app.get('/profile', function (req,res) {
	//finds user currently logged in
	req.currentUser(function (err,user) {
		if (user) {
			res.sendFile(__dirname + '/public/views/index.html');
		} else {
			res.redirect('/');
		}
	});
});

//authorization routes

//create new user with secure password
app.post('/users', function (req,res){
	var newUser = req.body.user;
	// res.json(newUser);

	User.createSecure(newUser, function (err,user){
	// 	//log in user immediately when created
		req.login(user);
		res.redirect('/main');
	});
});

//log in a user

app.post('/login', function(req,res){
	var userData = req.body.user;

	//call authenticate to check if pw is correct
	User.authenticate(userData.email, userData.password, function(err,user){
	
		//saves user id to session
		req.login(user);

		//redirect to page
		res.redirect('/main');
	});
});

app.get('/logout', function (req,res){
	req.logout();
	res.redirect('/');
})



//API routes

//show current user

app.get('/api/users/current', function (req, res){
	req.currentUser(function (err, user){
		res.json(user);
	});
});


//get goal by _id number

app.get('/api/goals/:id', function (req,res){
	var targetId = req.params.id;
	Goal.findOne({_id: targetId}, function(err, foundGoal){
		if (err) {
			console.log('Someone call Batman!', err);
			res.status(500).send(err);
		} else {
		res.json(foundGoal);
		}
	});
});


//create new goal for current user

app.post('/api/goals/current/goals', function (req,res){
	//creating a new goal with input from site
	var newGoal = new Goal ({
		goal: req.body.goal,
		description: req.body.description
	});

	//save the new goal
	newGoal.save();

	//find current user
	req.currentUser(function(err,user){
		//embed new goal into user
		user.goals.push(newGoal);
		//save user (and new log)
		user.save();
		//respond with new log
		res.json(newGoal);
	});
});

//goals index

app.get('/api/goals', function (req,res) {
	Goal.find(function(err, goals){
		if (err) {
			console.log('ERROR!', err);
			res.status(500).send(err);
		} else {
		res.json(goals);
		}
	});
});

//create a new goal

app.post('/api/goals', function(req,res){
	var newGoal = new Goal ({
		goal: req.body.goal,
		description: req.body.description
	});
});

//update or edit a goal

app.put('/api/goals/:id', function (req,res) {
	var targetId = (req.params.id)
	Goal.findOne({_id:targetId}, function (err,foundGoal) {

	foundGoal.goal = req.body.goal || foundGoal.goal;
	foundGoal.description = req.body.description || foundGoal.description;

		foundGoal.save(function(err,savedGoal){
			if (err) {
				console.log('HELP!', err);
				res.status(500).send(err);
			} else {
			res.json(savedGoal);
			}
		});
	});
});

//delete goal

app.delete('/api/goals/:id', function(req,res){
	var targetId = (req.params.id);
	Goal.findOneAndRemove({_id: targetId}, function(err,deletedPost){
		if (err) {
			console.log('You have issues!', err);
			res.status(500).send(err);
		} else {
		res.json(deletedPost);
		}
	});
});

// listen on port 3000
app.listen(process.env.PORT || 3000);
  console.log('server started on localhost:3000');
