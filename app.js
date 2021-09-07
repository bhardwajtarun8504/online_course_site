
const { name } = require("ejs");
var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/User");
const port = 8000;

mongoose.connect("mongodb://localhost/login_users", { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true});
var app = express();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


//============S

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
app.post("/register",async (req, res)=>{
try {
    const userregister = new User({
        username : req.body.username,
        email : req.body.email, 
        password : req.body.password,
        contact : req.body.contact
    })
    const registered =await userregister.save();
    res.render("login",{text: "Successsfully Registerd !! Login Now"});
} catch (error) {
    res.render("register",{text:  "already registerd with email or username"})
}
});

//render login form
app.get("/login", function (req, res) {
    res.render("login",{text:"   "});
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail =await User.findOne({ email : email })
        // console.log(useremail.email);
        if (useremail.password === password) {
            res.render("secret", {text: useremail.username ,id: useremail.id});
            // console.log("password compared");
        }
        else {
            res.render("login",{text: "Password not Matched"});
        }
    } catch (error) {
        res.render("login",{text: "Email Not registerd Yet"})
    }
})

app.get("/forget_password",(req,res)=>{
    res.render("forget_password",{text: "  "});
});

app.post("/forget_password",async (req,res) =>{
    try {
    const newpassword = req.body.new_password;
    const repassword = req.body.confirm_password;
    if(newpassword === repassword){
        await User.updateOne({ email: req.body.email},{$set: {password : newpassword}})
        res.render("login",{text: "Password Update"})
    }
    else{
        res.render("forget_Password",{text: "confirm password not matched"})
        }
    } catch (error) {
        res.render("forget_Password",{text: "This Email is Not Registerd Yet"})
    }    
})

app.get("/logout", function (req, res) {
    res.redirect("/");
});


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


// user profile 
app.get('/user_profile/:id', async (req, res) => {
    const user_data = await User.findById(req.params.id);
    // console.log(user_data);
    // console.log(req.user);
    res.render('courses/profile', {user_data: user_data});
})

// user account details
app.get('/user_account/:id',async (req, res) => {
    const user_data = await User.findById(req.params.id);
    res.render('courses/account', {user_data: user_data , text:" "});
    // res.render('courses/account',{text:" "});
});

app.post("/user_account", async (req, res) => {
    try {
        const useremail = await User.findOne({ email: req.body.email })
        if (useremail.password === req.body.password) {
            const updateuser = await User.updateOne({ email: req.body.email }, { $set: { contact: req.body.contact, status: req.body.status } });
            res.status(201).send("profile update successfully")
        }
        else {
        res.render('courses/account',{user_data: user_data, text:"Email or password not matched"});
        }
    } catch (error) {
        res.render('courses/account',{user_data: user_data, text:"This Email is not Registered"});
    }
});

app.get('/setting', (req, res) => {
    res.render("courses/setting",{text:" "});
})

app.post("/password_update", async (req, res) => {
    try {
        const newpassword = req.body.new_password;
        const repassword = req.body.retype_password;
        if(newpassword === repassword){
            const useremail = await User.findOne({ email: req.body.email })
            if(useremail.password === req.body.current_password){
            const updatepassword = await User.updateOne({ email: req.body.email},{$set: {password : newpassword}});
            res.render("courses/setting",{text:"Password Update successfully"})
            }
            else{
            res.render("courses/setting",{text:"Wrong Email or password"})
            }
        }
        else{
            res.render("courses/setting",{text: "password and confirm password not matched"})
        }
    } catch (error) {
        res.render("courses/setting",{text:"Wrong Email or password"})
    }
})

app.post("/delete_account", async (req, res) => {
    const deleteemail = await User.findOne({ email: req.body.email })
    if (deleteemail.password === req.body.password) {
        const deleteuser = await User.deleteOne({ email: req.body.email })
        res.redirect("/");
    }
    else
        res.redirect("/setting")
})

app.listen(port, function () {
    console.log(`server started....... ${port}`);
})