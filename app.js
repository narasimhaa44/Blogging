require("dotenv").config();
const express=require("express");
const userRoute=require("./routes/user");
const mongoose=require("mongoose");
const path=require("path");
const user=require("./models/user");
const blogs=require("./models/blog");
const blogRoute=require("./routes/blog");
const cookieparser=require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app=express();
const PORT=process.env.PORT ||8000;
mongoose.connect(process.env.MONGO_URL).then(()=>console.log("MongodB Connected"));
app.set("view engine","ejs");
app.set('views',path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve("./publics")))

app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.get("/",async (req,res)=>{
    const allBlogs=await blogs.find({});
    res.render("home",{user:req.user,blogs:allBlogs});
});



app.listen(PORT,()=>console.log(`server started at port: ${PORT}`));
