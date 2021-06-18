const express=require('express');
const router=express.Router();
const user=require('./user')
const formidable=require("formidable");
const _=require("lodash");
const fs= require("fs");
const {signin}= require("../controller/auth")
const bodyParser=require('body-parser')
const group=require('./group')
//router.post('/signin',sign);
router.get('/signup',(req,res)=>{
    res.status(200).json("hello");
});

router.post('/signin',signin);

const signup=(req,res)=>{
   let form =new formidable.IncomingForm();
   form.keepExtensions=true;
   form.parse(req,(err,feilds,files)=>{
    if(err){
        return res.status(400).json({
            error:"image could not be uploaded"
        });
    }

    const {name,email,password}=feilds;
		if(!name||!email||!password){
			return res.status(400).json({
				error:"enter all fields"
			});
		}
        let User=new user(feilds)
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                    error:"image could not be uploaded"
    
                });
            }
            User.photo.data=fs.readFileSync(files.photo.path);
            User.photo.contentType=files.photo.type;
        }

        User.save((err,result)=>{
            if (err) {
                   return res.status(400).json({
                       error: err
                   });
               }
               res.json(result);
       });
   })
        
}

const creategroup=(req,res)=>{
    const Group=new group(req.body);
    Group.save((err,result)=>{
        if(err){
            return res.json({error:"could not create group"})
        }else{
            return (res.json(result));
        }
    })

}
const listgroups=(req,res)=>{
    group.find({}, function(err, docs){
        if (!err) { 
            res.status(200).json(docs)
        }

        else {
            res.status(200).json({error:"could not list groups"})
        }
    }).select('name _id');
}

const listmsg=(req,res)=>{
    console.log(req.body);
    try {
        group.findById(req.body).select("messages").exec((err,result)=>{
            if(err){
                res.status(400).json({error:"no msg"})
            }else{
            console.log(result.messages)
          res.json(result.messages)
            }
           })
    } catch (error) {
        res.satus(400).json({error:"error"})
    }
};
const userById = (req, res, next, id) => {
    user.findById(id).exec((err, user1) => {
        if (err || !user1) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user1;
        next();
    });
};

const prodid= (req, res, next, id) => {
    user.findById(id).select('-hpassword ').exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        console.log(user)
        req.product = user;
        next();
    });
};
const photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-Type',"jpeg");
        return res.send(req.product.photo.data);
    }
    next();
};
router.post('/signup',signup);
router.post('/group/create',creategroup);
router.get('/list/groups',listgroups);
router.post('/list/msg',listmsg);
router.get('/img/:prodid',photo);

router.param("userId",userById)
router.param("prodid",prodid)


module.exports=router;

