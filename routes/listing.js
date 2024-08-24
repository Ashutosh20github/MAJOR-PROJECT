const express = require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const { listingSchema }=require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listings=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage })



// const validateListing = (req,res,next)=>{
//     let { error }=listingSchema.validate(req.body);
//     if(error){
//      let errMsg=error.details.map((el)=>el.message).join(",");
//      throw new ExpressError(400,errMsg);
//     }
//     else{
//      next();
//     }
//  }

router.route("/")
.get(listingController.index)
.post(isLoggedIn,upload.single('listing[image]'),validateListing,listingController.createListing)

// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(listingController.showListing)
// .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,listingController.updateListing)
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,listingController.updateListing)
.delete(isLoggedIn,isOwner,listingController.destroyListing)


//Index Route
// router.get("/",listingController.index);

//New Route

//Show Route
// router.get("/:id",listingController.showListing);
//create-route
// router.post("/",isLoggedIn,validateListing,listingController.createListing);
 
 
 //Edit route
 router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm);
 
 //update route
//  router.put("/:id",isLoggedIn,isOwner,validateListing,listingController.updateListing);
 
 
 //Delete Route
//  router.delete("/:id",isLoggedIn,isOwner,listingController.destroyListing);


module.exports=router