const Listings=require("../models/listing");
const Reviews=require("../models/review");



module.exports.createReview=async(req,res)=>{
    let listing= await Listings.findById(req.params.id);
    let newReview= new Reviews(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
   
}

module.exports.destroyReview=async(re,res)=>{
    let {id, reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","review deletd!");
    res.redirect(`/listings/${id}`);
}