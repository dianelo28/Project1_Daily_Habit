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
var db = require ('./models/models');
mongoose.connect('mongodb://localhost/workout');


//set view engine for server-side templating
app.set('view engine', 'ejs');

//middleware - set session options

app.use(session({
	saveUninitialized: true,
	resave: true,
	secret: 'SuperSecretCookie',
	cookie: { maxAge: 60000}
}));

//middleware to manage sessions

app.use('/', function(req,res, next){
	//saves userId in session for logged in user
	req.login = function (user){
		req.session.userId = user.id;
	};

	//finds user currently logged in based on 'session.userId'
	req.currentUser = function (callback) {
		db.User.findOne({_id: req.session.userId}, function(err,user){
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
  res.sendFile(__dirname + '/public/views/signup.html');
});

//sign up page

// app.get('/signup', function (req,res){
// 	res.send('coming soon!');
// });

//main page

app.get('/main', function (req, res) {
	res.sendFile(__dirname + '/public/views/index.html');
});

//user profile page

app.get('/profile', function (req,res) {
	//finds user currently logged in
	req.currentUser(function(err,user) {
		res.send('Welcome ' + user.email);
	});
});

//goals index

app.get('/goals', function (req,res) {
	db.Goal.find(function(err, goals){
		res.json(goals);
	});
});

//get goal by _id number

app.get('/goals/:id', function (req,res){
	var targetId = req.params.id;
	db.Goal.findOne({_id: targetId}, function(err, foundGoal){
		res.json(foundGoal);
	});
});

//user sign up form submission

app.post('/users', function(req,res){

	//grab user data from params(req.body)
	var newUser = req.body.user;

	//create new user with secure pw
	db.User.createSecure(newUser.email, newUser.password, function(err,user){
		res.redirect('/main');
	});
});

//log in a user

app.post('/login', function(req,res){
	var userData = req.body.user;

	//call authenticate to check if pw is correct
	db.User.authenticate(userData.email, userData.password, function(err,user){
	
		//saves user id to session
		req.login(user);

		//redirect to page
		res.redirect('/profile')
	});
});

//create new goal

app.post('/goals', function (req,res){
	var goal = new db.Goal ({
		goal: req.body.goal,
		description: req.body.description
	});

	goal.save(function(err, goal){
		res.json(goal)
	});
});

//update or edit a goal

app.put('/goals/:id', function (req,res) {
	var targetId = (req.params.id)
	db.Goal.findOne({_id:targetId}, function (err,foundGoal) {
		console.log("this is foundGoal");
		console.log(foundGoal);

	foundGoal.goal = req.body.goal || foundGoal.goal;
	foundGoal.description = req.body.description || foundGoal.description;

		foundGoal.save(function(err,savedGoal){
			res.json(savedGoal);
		});
	});
});

//delete goal

app.delete('/goals/:id', function(req,res){
	var targetId = (req.params.id);
	db.Goal.findOneAndRemove({_id: targetId}, function(err,deletedPost){
		res.json(deletedPost);
	});
});

// listen on port 3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});
