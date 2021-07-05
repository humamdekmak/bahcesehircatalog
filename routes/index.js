var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var Program = require("../models/program");
var Job = require("../models/job");
var Page = require("../models/page");
//root route
router.get("/", function(req, res){
	var currentTab = "search";
    res.render("landing", {currentTab : currentTab});
});

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Bahcesehir Catalog " + user.username);
           res.redirect("/programs"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

//handling login logic
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/programs';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/programs");
});







router.get("/emerging", function(req, res){
	var currentTab = "references";
   res.render("emerging", {currentTab:currentTab}); 
});

router.get("/aboutx", function(req, res){
	var currentTab = "about";
   res.render("about", {currentTab:currentTab}); 
});

router.get("/deanx", function(req, res){
	var currentTab = "about";
   res.render("dean", {currentTab:currentTab}); 
});

router.get("/page1", function(req, res){
	var currentTab = "about";
   res.render("page1", {currentTab:currentTab}); 
});

router.get("/page2", function(req, res){
	var currentTab = "about";
   res.render("page1", {currentTab:currentTab}); 
});


// admin panel
router.get("/admin", function(req, res){
   res.render("admin/index"); 
});

router.get("/admin/programs", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all programs from DB
        Program.find({name: regex}, function(err, allPrograms){
           if(err){
               console.log(err);
           } else {
              if(allPrograms.length < 1) {
                  noMatch = "No Program match that query, please try again.";
				  var currentTab = "programs";
              }
              res.render("admin/programs",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    } else {
        // Get all programs from DB
        Program.find({}, function(err, allPrograms){
           if(err){
               console.log(err);
           } else {
			   var currentTab = "programs";
              res.render("admin/programs",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    }
});




router.get("/admin/jobs", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all programs from DB
        Job.find({name: regex}, function(err, allJobs){
           if(err){
               console.log(err);
           } else {
              if(allJobs.length < 1) {
                  noMatch = "No Job match that query, please try again.";
				  var currentTab = "jobs";
              }
              res.render("admin/jobs",{jobs:allJobs, noMatch: noMatch, currentTab:currentTab});
           }
        });
    } else {
        // Get all programs from DB
        Job.find({}, function(err, allJobs){
           if(err){
               console.log(err);
           } else {
			   var currentTab = "programs";
              res.render("admin/jobs",{jobs:allJobs, noMatch: noMatch, currentTab:currentTab});
           }
        });
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/admin/pages", function(req, res){

        // Get all programs from DB
        Page.find({}, function(err, allPages){
           if(err){
               console.log(err);
           } else {
			   var currentTab = "programs";
              res.render("admin/pages",{pages:allPages, currentTab:currentTab});
           }
        })
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//pages

router.get("/admin/pages/newpage", function(req, res){
   res.render("admin/newpage"); 
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/admin/pages/newpage", function(req, res){
    // get data from form and add to programs array
	var name = req.body.name;
	var content = req.body.content;
    var newPage = {name:name , content:content}
    // Create a new programs and save to DB
    Page.create(newPage, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to programs page
            console.log(newlyCreated);
            res.redirect("/admin/pages");
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get("/:name", function(req, res){
    //find the program with provided ID
    Page.findOne({"name":req.params.name}).populate("").exec(function(err, foundPage){
        if(err){
            console.log(err);
			res.redirect("/")
        } else if (foundPage) {
            console.log(req.params);
			var currentTab = "programs";
            //render show template with that program
            res.render("showpage", {page: foundPage, currentTab:currentTab});

		}
    });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDIT PAGE ROUTE
router.get("/admin/pages/:name/edit", function(req, res){
    Page.findOne({"name":req.params.name}, function(err, foundPage){
        res.render("admin/editpage", {page: foundPage});
    });
});


router.put('/:name', async function(req,res){
var query = {name: req.params.name};
var update = {name:req.body.name,content:req.body.content};
Page.findOneAndUpdate(query,update,{upsert:true}, function(error,updatedPage){
    if(error){
    	console.log(error);
    }else{
		req.flash("success", "You Edited the Page successfully");
        res.redirect("/admin/pages");
    }
})

});



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.delete("/:name", function(req, res){
   Page.findOneAndRemove({name:req.params.name}, function(err){
      if(err){
		  console.log(err);
          res.redirect("/admin/pages");
      } else {
		  req.flash("success", "You Deleted the Page successfully");
          res.redirect("/admin/pages");
      }
   });
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;