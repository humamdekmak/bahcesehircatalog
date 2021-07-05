var express = require("express");
var router  = express.Router();
var Job = require("../models/job");
var middleware = require("../middleware");


//INDEX - show all programs
router.get("/", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all programs from DB
        Job.find({name: regex}, function(err, allJobs){
           if(err){
               console.log(err);
           } else {
              if(allJobs.length < 1) {
                  noMatch = "No Program match that query, please try again.";
              }
              res.render("jobs/index",{jobs:allJobs, noMatch: noMatch});
           }
        });
    } else {
        // Get all programs from DB
        Job.find({}, function(err, allJobs){
           if(err){
               console.log(err);
           } else {
              res.render("jobs/index",{jobs:allJobs, noMatch: noMatch});
           }
        });
    }
});

//CREATE - add new programs to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to programs array
	var department = req.body.department;
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
	var requirements = req.body.requirements;
	var respons = req.body.respons;	
	var salary = req.body.salary;	
    var newJob = {department:department , name: name, image: image, description: desc, requirements:requirements, respons:respons, salary:salary}

    // Create a new programs and save to DB
    Job.create(newJob, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to programs page
            console.log(newlyCreated);
            res.redirect("/jobs");
        }
    });
});

//NEW - show form to create new program
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("jobs/new"); 
});

// SHOW - shows more info about one program
// router.get("/:programName", function(req, res){
//     //find the program with provided ID
//     Program.findOne({programName:req.params.programName}).populate("").exec(function(err, foundProgram){
//         if(err){
//             console.log(err);
// 			res.redirect("/programs")
//         } else {
//             console.log(foundProgram);
//             //render show template with that program
//             res.render("programs/show", {program: foundProgram});
//         }
//     });
// });


router.get("/:id", function(req, res){
    //find the program with provided ID
    Job.findById(req.params.id).populate("").exec(function(err, foundJob){
        if(err){
            console.log(err);
			res.redirect("/jobs")
        } else if (foundJob) {
            console.log(foundJob);
            //render show template with that program
            res.render("jobs/show", {job: foundJob});
        }else{
			res.redirect("/jobs")
		}
    });
});

// EDIT PROGRAM ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Job.findById(req.params.id, function(err, foundJob){
        res.render("jobs/edit", {job: foundJob});
    });
});

// UPDATE PROGRAM ROUTE
router.put("/:id",middleware.isLoggedIn, function(req, res){
    // find and update the correct Program
    Job.findByIdAndUpdate(req.params.id, req.body.job, function(err, updatedProgram){
       if(err){
		   console.log(err);
           res.redirect("/jobs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/jobs/" + req.params.id);
       }
    });
});

// DESTROY PROGRAM ROUTE
router.delete("/:id",middleware.isLoggedIn, function(req, res){
   Job.findByIdAndRemove(req.params.id, function(err){
      if(err){
		  console.log(err);
          res.redirect("/jobs");
      } else {
          res.redirect("/jobs");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

