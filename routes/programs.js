var express = require("express");
var router  = express.Router();
var Program = require("../models/program");
var middleware = require("../middleware");


//INDEX - show all programs
router.get("/", function(req, res){
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
              res.render("programs/index",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    } else {
        // Get all programs from DB
        Program.find({}, function(err, allPrograms){
           if(err){
               console.log(err);
           } else {
			   var currentTab = "programs";
              res.render("programs/index",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    }
});

router.get("/graduate", function(req, res){
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
              res.render("programs/graduate",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    } else {
        // Get all programs from DB
        Program.find({}, function(err, allPrograms){
           if(err){
               console.log(err);
           } else {
			   var currentTab = "programs";
              res.render("programs/graduate",{programs:allPrograms, noMatch: noMatch, currentTab:currentTab});
           }
        });
    }
});

//CREATE - add new programs to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to programs array
	var department = req.body.department;
	var faculty = req.body.faculty;
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
	var description_link = req.body.description_link;
	var graduate_programs = req.body.graduate_programs;	
    var newProgram = {department:department , faculty:faculty, name: name, image: image, description: desc, description_link:description_link, graduate_programs:graduate_programs}
    // Create a new programs and save to DB
    Program.create(newProgram, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to programs page
            console.log(newlyCreated);
            res.redirect("/programs");
        }
    });
});

//NEW - show form to create new program
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("programs/new"); 
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
    Program.findById(req.params.id).populate("").exec(function(err, foundProgram){
        if(err){
            console.log(err);
			res.redirect("/programs")
        } else if (foundProgram) {
            console.log(req.params);
			var currentTab = "programs";
            //render show template with that program
            res.render("programs/show", {program: foundProgram, currentTab:currentTab});
        }else{
			res.redirect("/programs")
		}
    });
});

// EDIT PROGRAM ROUTE
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Program.findById(req.params.id, function(err, foundProgram){
        res.render("programs/edit", {program: foundProgram});
    });
});

// UPDATE PROGRAM ROUTE
router.put("/:id",middleware.isLoggedIn, function(req, res){
    // find and update the correct Program
    Program.findByIdAndUpdate(req.params.id, req.body.program, function(err, updatedProgram){
       if(err){
		   console.log(err);
           res.redirect("/programs");
       } else {
           //redirect somewhere(show page)
           res.redirect("/programs/" + req.params.id);
       }
    });
});

// DESTROY PROGRAM ROUTE
router.delete("/:id",middleware.isLoggedIn, function(req, res){
   Program.findByIdAndRemove(req.params.id, function(err){
      if(err){
		  console.log(err);
          res.redirect("/programs");
      } else {
          res.redirect("/programs");
      }
   });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

