

const user=require("../models/user")
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt"); 
require("dotenv").config();





exports.signin=(req,res)=>{
	//res.send("hello");
   


	const {email,password}=req.body;
    console.log(password);
	user.findOne({email:req.body.email},(err,fuser)=>

		{
if(err||!fuser){
    //console.log(err);
	return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
	// create authenticate method in user model
       
}else  if (!fuser.authenticate(password)) {
    console.log(fuser.authenticate(password))
            return res.status(401).json({
                error: "Email and password dont match"
            });}

else{
const token =jwt.sign({_id:fuser._id},process.env.secret);
res.cookie("t", token, { expire: new Date() + 9999 });
  const { _id, name, email, role } = fuser;
        return res.json({ token, user: { _id, email, name} });

}		

});

	
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
    console.log( "Signout success")
};


exports.requireSignin = expressJwt({
    secret: process.env.secret,
    algorithms: ["HS256"],
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
   

    if (!user) {
        
        return res.status(403).json({
            error: "Access denied not a user",
            user: user
        });
    }
    //console.log(user);
    //console.log(req.profile);
       // console.log(req.auth);
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied"
        });
    }
    next();
};

//module.exports=respond;
//module.exports={sum};
//console.log("process",process)