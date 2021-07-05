var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Program  = require("./models/program"),
	Job  = require("./models/job"),
    User        = require("./models/user"),
    Page        = require("./models/page");

//    seedDB      = require("./seeds")
    
//requiring routes
var  programRoutes = require("./routes/programs"),
	jobRoutes = require("./routes/jobs"),
    indexRoutes      = require("./routes/index")
    
// mongoose.connect("mongodb://localhost/in_app_search4");
var uri = "mongodb://root:BaHcE123@bahcesehircatalog.kkj4g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
	
	
mongoose.connect("mongodb://root:BaHcE123@bahcesehircatalog-shard-00-00.kkj4g.mongodb.net:27017,bahcesehircatalog-shard-00-01.kkj4g.mongodb.net:27017,bahcesehircatalog-shard-00-02.kkj4g.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-di8dl6-shard-0&authSource=admin&retryWrites=true&w=majority", {
	useNewUrlParser : true,
	useCreateIndex:true
}).then(() => {
	console.log("connected mongodb atlas")
}).catch(err => {
	console.log(err.message)
})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
	res.locals.currentTab = "";
   next();
});





// relational database///////////////
app.use(function(req, res, next) {
  Program.find({}, (err, programs) => {
    if (err) return next(err);
    res.locals.programs = programs;
    return next();
  });
});


////////////////////////////////////
// relational database///////////////
app.use(function(req, res, next) {
  Job.find({}, (err, jobs) => {
    if (err) return next(err);
    res.locals.jobs = jobs;
    return next();
  });
});


////////////////////////////////////
app.use(function(req, res, next) {
  Page.find({}, (err, pages) => {
    if (err) return next(err);
    res.locals.pages = pages;
    return next();
  });
});
////////////////////////////////////
app.use("/programs", programRoutes);
app.use("/jobs", jobRoutes);
app.use("/", indexRoutes);


var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function(){
   console.log("The Bahcesehir Catalog Server Has Started!");
});