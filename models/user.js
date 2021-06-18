const mongoose = require("mongoose");
const uuid=require("uuid/v1");
const crypto=require("crypto");

const schema= mongoose.Schema({
name:{
    type:String,
    required:true,
    max:32
},
email:{
    type:String,
    required:true,
    unique: true,
    max:32
},
hpassword:{
    type:String
},
salt:{
	type:String
},
groupid:{},
photo: {
    data: Buffer,
    contentType: String
}

})
schema.virtual("password").set(function(password){
this.salt=uuid();
this.hpassword=this.epassword(password)
})

schema.methods={

	authenticate: function(plainText){
        
        console.log(this.epassword(plainText) ===this.hpassword);
		return this.epassword(plainText)===this.hpassword;
	},

epassword: function(password){
		if(!password)return"";
		try{
			return crypto
			.createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
	}
};
module.exports=mongoose.model("user",schema);