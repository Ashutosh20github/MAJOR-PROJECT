const express = require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema }=require("../schema.js");
const { Reviews }=require("../models/review.js");
const Listings=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js");



// const validateReview = (req,res,next)=>{
//     let { error }=reviewSchema.validate(req.body);
//     if(error){
//      let errMsg=error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,errMsg);
//     }
//     else{
//      next();
//     }
//  }

//post-review route
router.post("/",isLoggedIn,validateReview,reviewcontroller.createReview);
//Delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewcontroller.destroyReview);

module.exports=router;