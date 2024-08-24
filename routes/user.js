const express = require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport=require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const usercontroller=require("../controllers/users.js");


router.route("/signup")
.get(usercontroller.renderSignUpForm)
.post(usercontroller.signup);

router.route("/login")
.get(usercontroller.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),usercontroller.login);
// router.get("/signup",usercontroller.renderSignUpForm);

// router.post("/signup",usercontroller.signup);

// router.get("/login",usercontroller.renderLoginForm);


// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",{
//     failureRedirect:"/login",
//     failureFlash:true,
// }),usercontroller.login);



router.get("/logout",usercontroller.logout);

module.exports=router;