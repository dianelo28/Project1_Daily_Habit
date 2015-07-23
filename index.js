//server side JS

// require express framework and additional modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore'),
    ejs = require('ejs'),
    bcrypt = require('bcrypt'),
    salt = bcrypt.genSaltSync(10),
    unirest = require('unirest'),
    dotenv = require('dotenv'),
    session = require('express-session');

// tell app to use bodyParser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

//dot env
dotenv.load();

//mongoose/models

var mongoose = require('mongoose');
var Goal = require ('./models/goal');
var User = require('./models/user');
var Train = require('./models/train');
var env = process.env;
// var config = require('./config')

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
	secret: env.SESSION_SECRET,
	cookie: { maxAge: 60000 }
}));

//middleware to manage sessions

// app.use('/', function(req,res, next){
// 	//saves userId in session for logged in user
// 	req.login = function (user){
// 		req.session.userId = user.id;
// 	};

// 	//finds user currently logged in based on 'session.userId'
// 	req.currentUser = function (callback) {
// 		User.findOne({_id: req.session.userId}, function(err,user){
// 			req.user = user;
// 			callback(null, user);
// 		});
// 	};

// 	//destroy 'session.userId' to log out user
// 	req.logout = function(){
// 		req.session.userId = null;
// 		req.user = null;
// 	};

// 	next();
// })

//info

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

//signup

app.get('/signup', function (req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

//user profile page

app.get('/profile', function (req,res) {
	//finds user currently logged in
	User.findOne({_id: req.session.userId}, function(err,user){
		// console.log(user)
		req.user = user;
		//if user exists, send to their profile
		if (user) {
			res.sendFile(__dirname + '/public/views/profile.html');
		} else {
			res.redirect('/');
		}
	});
});

//authorization routes

//create new user with secure password
app.post('/users', function (req,res){
	//get the email from form

	User.findOne({ 
		email: req.body.email 
	}, 
	function(err,user){
		
		if (user) {
			res.status(400).send ({ message:'Email already exists!'})
		} else {
			User.createSecure(req.body, function (err,user){
		 		//log in user immediately when created
				req.session.userId = user.id
				res.status(201).send(user)

			})	
		}
	});
});

//log in a user

app.post('/login', function(req,res){
	var userData = req.body.user;

	//call authenticate to check if pw is correct
	User.authenticate(userData.email, userData.password, function(err,user){
	
		//session for user
		console.log(req.session.userId)
		req.session.userId = user.id

		//redirect to page
		res.redirect('/profile');
	});
});

app.get('/logout', function (req,res){
	req.session.userId = null;
	res.redirect('/');
})



//API routes

//show current user

app.get('/api/users/current', function (req, res){
	User.findOne({_id: req.session.userId}, function(err,user){
		// console.log(user)
		req.user = user;
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

app.post('/api/users/current/goals', function (req,res){
	//creating a new goal with input from site
	var newGoal = new Goal ({
		goal: req.body.goal,
		description: req.body.description
	});

	//save the new goal
	console.log(newGoal);
	newGoal.save();

	//find current user
		User.findOne({_id: req.session.userId}, function (err, user) {
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

	newGoal.save();

	console.log(newGoal);
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

//selected goal with dropdown

app.get('/api/dropdown', function(req,res){
	var targetId = (Train.find({goal: req.body.goalsSelect}))._id;
	console.log(targetId);
	// Train.find({goal: goal}, function(err, train){
		if (err){
			console.log('nope!', err);
			res.status(500).send(err);
		} else {
			res.json(train)
		}
	})


//food2fork API

// unirest.get("https://community-food2fork.p.mashape.com/search?key=7265727d95515b59e5a8f7e7ec0f3d9f&q=" + search + "&sort=rating")
// .header("X-Mashape-Key", "eqGe7SasOCmshHHd4jnPnA5MeUlzp1eY22Vjsn7GvsKlYaYo5i")
// .header("Accept", "application/json")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

// listen on port 3000
app.listen(process.env.PORT || 3000)