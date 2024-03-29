var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Campground = require("../models/campground");
//root route
router.get("/", function(req, res){
	res.render("landing");
})


//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			avatar: req.body.avatar,
			email: req.body.email
		});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/campgrounds");
        });
    });
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'});
});
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect:"/login"
	}), function(req, res){
//calback here
});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you out!");
	res.redirect("/campgrounds");
});

//uer profile
router.get("/users/:id", function(req, res){
	User.findById(req.params.id, function(err, foundUser){
		if(err){
			req.flash("error", "User not found");
			res.redirect("/");
		}
		Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/");
			}
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		})
	})
})


module.exports = router;
