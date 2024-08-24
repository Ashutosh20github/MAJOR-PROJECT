const express=require("express");
const app = express();
const ExpressError=require("./ExpressError");


// app.use((req,res,next)=>{
//     console.log("Hi I am middleware");
//     next();
// });


// app.use((req,res,next)=>{
//     console.log("Hi I 2nd middleware");
//     next();
// });
const checktoken=(req,res,next)=>{
    let {token}=req.query;
    if(token==="giveaccess"){
        next();
    }
    throw new ExpressError(401,"ACCESS DENIED");
}

app.get("/api",checktoken,(req,res)=>{
    res.send("data");
})
app.use("/random",(req,res,next)=>{
    console.log("I am only for random");
    next();
})
app.use((req,res,next)=>{
    req.time= new Date(Date.now());
    console.log(req.method,req.hostname,req.path,req.time);
    next();
})
app.get("/err",(req,res)=>{
    abcd=abcd;

}
);

app.get("/admin",(re,res)=>{
    throw new ExpressError(403,"Acess to admin is forbidden");
})
app.use((err,req,res,next)=>{
    let {status=500,message="some error occured"}=err;
    res.status(status).send(message);

})
app.use((err,req,res,next)=>{
    console.log("____Error2___");
    next(err);
})
//404
app.use((req,res)=>{
    res.status(404).send("page not found");
})

app.get("/",(req,res)=>{
    res.send('Hi i am root');
});

app.get("/random",(req,res)=>{
    res.send('Hi i am random page');
});



app.listen("8080",()=>{
    console.log("server is listening to port 8080");
});