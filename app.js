
const { name } = require("ejs");
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/User");
// LocalStrategy         = require("passport-local"),
// passportLocalMongoose = require("passport-local-mongoose");
const port = 8000;

mongoose.connect("mongodb://localhost/login_users", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(require("express-session")({
//     secret: "Rusty is the best and cutest dog in the world",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser())

//============
// ROUTES
//============

app.get("/", function (req, res) {
    res.render("home");
});

// Auth Routes

//show sign up form
app.get("/register", function (req, res) {
    res.render("register",{text:  ""})
});
//handling user sign up
app.post("/register", async (req, res)=>{
//         User.register(new User({email : req.body.email,username: req.body.username}), req.body.password, function(err, user){
//     if(err){
//         res.send(err);
//         return res.render('register');
//     }
//     passport.authenticate("local")(req, res, function(){
//           res.redirect("/secret");
//     });
// }); 
try {
    const userregister = new User({
        username : req.body.username,
        email : req.body.email, 
        password : req.body.password,
        contact : req.body.contact
    }) 
    const registered = await userregister.save();
    res.render("secret",{text: req.body.username});
} catch (error) {
    res.render("register",{text:  "already registerd with email or username"})
}
});

// LOGIN ROUTES
// app.get("/secret", function(req, res){
//     res.render("secret",{text: req.user.username}); 
//  });
//render login form
app.get("/login", function (req, res) {
    res.render("login",{text:"   "});
});

// login logic
// middleware
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/login",
// }) ,function(req, res){
// });

app.post("/login", async (req, res) => {
    // console.log(req.user.username);
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await User.findOne({ email: email })
        if (useremail.password === password) {
            res.render("secret", { text: useremail.username , id: useremail.id});
        }
        else {
            res.render("login",{text: "Password not Matched"})
        }
    } catch (error) {
        res.render("login",{text: "Email Not registerd Yet"})
    }
})

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});


// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         console.log('User logged in successfully');
//         return next();
//     }
//     res.redirect("/login");
// }

// // course registering 
app.get('/coding_course', (req, res) => {
    res.render('courses/course_1.ejs');
})
app.get('/python_course', (req, res) => {
    res.render('courses/course_2.ejs');
})
app.get('/C_course', (req, res) => {
    res.render('courses/course_3.ejs');
})
app.get('/CSS_course', (req, res) => {
    res.render('courses/course_4.ejs');
})
app.get('/HTML_course', (req, res) => {
    res.render('courses/course_5.ejs');
})
app.get('/JS_course', (req, res) => {
    res.render('courses/course_6.ejs');
})

app.get('/register-course', (req, res) => {
    res.render('courses/course_register');
})

app.get('/setting', (req, res) => {
    res.render("courses/setting")
})

// app.post("/setting",async(req,res)=>{
// //  const updateuser =await User.updateOne({email: req.user.email, password:req.body.password},{$set: {contact:req.body.contact , status:req.body.status}});
// })

app.get('/user_profile/:id', async (req, res) => {
    console.log(req.params.id);
    const user_data = await User.findById(req.params.id);
    console.log(user_data);
    // console.log(req.user);
    res.render('courses/profile', {user_data: user_data});
})

app.get('/user_account', (req, res) => {
    res.render('courses/account',{text:""});
})
app.post("/user_account", async (req, res) => {
    try {
        const useremail = await User.findOne({ email: req.body.email })
        if (useremail.password === req.body.password) {
            const updateuser = await User.updateOne({ email: req.body.email }, { $set: { contact: req.body.contact, status: req.body.status } });
            res.status(201).send("profile update successfully")
        }
        else {
        res.render('courses/account',{text:"Email or password not matched"});
        }
        
    } catch (error) {
        res.render('courses/account',{text:"This Email is not Registered"});
    }
  
});

app.post("/password_update", async (req, res) => {
  console.log(user_details.username)
})

app.post("/delete_account", async (req, res) => {
    const deleteemail = await User.findOne({ email: req.body.email })
    if (deleteemail.password === req.body.password) {
        const deleteuser = await User.deleteOne({ email: req.body.email })
        res.status(201).send("Your Account has been deleted successfully!!")
    }
    else
        res.redirect("/setting")
})

app.listen(port, function () {
    console.log(`server started....... ${port}`);
})