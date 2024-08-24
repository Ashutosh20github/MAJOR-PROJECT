const Listings=require("../models/listing")
//const mbxGeocoding=require('@maptiler/maptiler-sdk/services/geocoding');
// const mapToken=process.env.MAP_TOKEN;
// const baseClient=mbxGeocoding({accessToken:MY_ACCESS_TOKEN});

module.exports.index=async(req,res)=>{
    const allListings= await Listings.find({});
    res.render("listings/index.ejs",{ allListings });
};

module.exports.renderNewForm=(req,res)=>{
    res.render("Listings/new.ejs");  
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
   const listing= await Listings.findById(id)
   .populate({path:"reviews",
     populate:{
         path:"author",
     },
   })
   .populate("owner");
   if(!listing){
     req.flash("error","Listing does not exist");
     res.redirect("/listings");
   }
   console.log(listing);
   res.render("Listings/show.ejs",{listing});
 }


 module.exports.createListing=async(req,res,next)=>{
    // let {title,description,image,price,location}=req.body;
    // let result=listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //  throw new ExpressError(400,result.error);
    // }
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting = new Listings(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New listing created!");//requiring flash
    res.redirect("/listings");
    }

module.exports.renderEditForm = async(req,res)=>{
    let {id}=req.params;
    const listing= await Listings.findById(id);
    if(!listing){
       req.flash("error","Listing does not exist");
       res.redirect("/listings");
     }
     let originalImageUrl=listing.image.url
     originalImageUrl= originalImageUrl.replace("/upload","/upload/w_250");
    res.render("Listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing=async(req,res)=>{
  let {id}=req.params;
 let listing= await Listings.findByIdAndUpdate(id,{...req.body.listing});

if(typeof req.file!=="undefined")
{
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
}
  req.flash("success","listing Updated!");
  res.redirect(`/listings/${ id }`);
}

module.exports.destroyListing=async(req,res)=>{
  let { id }=req.params;
  let deletedListing=await Listings.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","listing deleted!");
  res.redirect("/listings");
}