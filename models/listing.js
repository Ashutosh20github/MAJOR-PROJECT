const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
       url: String,
       filename: String,
    
    },
    price:Number,
    location:String,
    Country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Reviews",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    category:{
        type:String,
        enum:["mountains","arctic","farms","deserts",]

    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
     if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}})
     }
})


const Listings=mongoose.model("Listing",listingSchema);

module.exports=Listings;


