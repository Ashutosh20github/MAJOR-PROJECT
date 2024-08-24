if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}

// console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose = require('mongoose');
const Listings=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema }=require("./schema.js");
const { Reviews }=require("./models/review.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js")




//const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';
const dbUrl=process.env.ATLAS_DB_URL;

main()
.then(()=>{
    console.log("Connected to db");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
  }

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter:24 * 3600,
})

store.on("error",()=>{
    console.log(" Error in mongo session store",err);
});

// app.get("/testListing",async(req,res)=>{
//     let samplelisting=new Listing({
//         title:"My new villa",
//         descritpion:"By the beach",
//         price:1200,
//         location:"calungete,Goa",
//         Country:"India",
//     })
//     await samplelisting.save();
//     console.log("sample was saved");
//     res.send("successful");
// })

// })


const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,

    },
};

// app.get("/",(req,res)=>{
//     res.send("Hello I am root");
// // });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get("/demouser",async(req,res)=>{
    let fakeuser=new User({
        email:"ashutosh123@gmail.com",
        username:"Ashutosh",

    });

   let registerUser=await  User.register(fakeuser,"helloworld");
   res.send(registerUser);
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);

const validateListing = (req,res,next)=>{
    let { error }=listingSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
    }
    else{
     next();
    }
 }
 
 const validateReview = (req,res,next)=>{
     let { error }=reviewSchema.validate(req.body);
     if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
     }
     else{
      next();
     }
  }


//Index Route
// app.get("/listings",async(req,res)=>{
//      const allListings= await Listings.find({});
//      res.render("listings/index.ejs",{ allListings });
// });

// //New Route
// app.get("/listings/new",(req,res)=>{
//     res.render("Listings/new.ejs");
// })
// //Show Route
// app.get("/listings/:id",async(req,res)=>{
//     let {id}=req.params;
//    const listing= await Listings.findById(id).populate("reviews");
//    res.render("Listings/show.ejs",{listing});
// })
// //Create route
// app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
//    // let {title,description,image,price,location}=req.body;
//    let result=listingSchema.validate(req.body);
//    console.log(result);
//    if(result.error){
//     throw new ExpressError(400,result.error);
//    }
//    const newlisting = new Listings(req.body.listing);
//    await newlisting.save();
//    res.redirect("/listings");
//    })
// );

// //Edit route
// app.get("/listings/:id/edit",async(req,res)=>{
//     let {id}=req.params;
//     const listing= await Listings.findById(id);
//     res.render("Listings/edit.ejs",{listing});
// })

// //update route
// app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     await Listings.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${ id }`);
// }));


// //Delete Route
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let { id }=req.params;
//     let deletedListing=await Listings.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));
//Reviews
//post Route
app.post("/listings/:id/reviews",validateReview,async(req,res)=>{
    let listing= await Listings.findById(req.params.id);
    let newReview= new Reviews(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
   
});

app.delete("/listings/:id/reviews/:reviewId",async(re,res)=>{
    let {id, reviewId}=req.params;
    await Listings.findByIdAndUpdate(id,{$pull:{reviews: reviewId}})
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})





app.all("*",(req,res,next)=>{
    next(new ExpressError(408,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went worng!"}=err;
    res.status(statusCode).render("error.ejs",{message});
   // res.status(statusCode).send(message);
})

app.listen("8080",()=>{
    console.log("server is listening to port 8080");
})