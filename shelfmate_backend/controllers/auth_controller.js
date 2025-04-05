const bcryptjs=require("bcryptjs")
const user_model=require("../models/user_model")
const jwt=require("jsonwebtoken")
const secret=require("../configs/auth_config")


exports.signup=async(req,res)=>{
    /**
     * Login to Create a User
     */
    // 1. Read th request body
    const request_body=req.body;

    // 2. Insert the data in the Userd collection in MongoDB
    const userObj={
        name : request_body.name,
        email : request_body.email,
        userId : request_body.userId,
        password : bcryptjs.hashSync(request_body.password,8)
    }

    try{
        const user_created=await user_model.create(userObj)
        /**
         * Return this user
         */

        const res_obj={
            name : user_created.name,
            email : user_created.email,
            createdAt : user_created.createdAt,
            updatedAt : user_created.updatedAt
        }
        res.status(201).send(res_obj)
    }
    catch(err){
        console.log("Error while registering the user",err)
        res.status(500).send({
            message : "Some error happened while registering the user"
        })
    }
}

exports.signin=async(req,res)=>{
    try{
        
        console.log("DEBUG: Full request body =>", req.body);

        const { identifier, password } = req.body;
        console.log("DEBUG: identifier =", identifier);
        console.log("DEBUG: password =", password);

        if (typeof identifier !== "string" || typeof password !== "string" || !identifier.trim() || !password.trim()){
        return res.status(400).send({
            message: "Identifier and password must be provided",
        });
    }


        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const user = await user_model.findOne(isEmail?{email:identifier} :{userId:identifier})

        if(user==null){
            return res.status(400).send({
                message : " User id or Email id not exist"
            })
        }

        /**
        * Password is Correct
        */

        const isPasswordValid=bcryptjs.compareSync(password,user.password)
        if(!isPasswordValid){
            return res.status(401).send({
                message : 'Worng password passed'
            })
        }

        // using jwt, we will create the access token with a given TTKLK and return 

        const token = jwt.sign({id : user.userId},secret.secret,{
            expiresIn : 120
        })

        res.status(200).send({
            name : user.name,
            userId : user.userId,
            email : user.email,
            accessToken : token
        })
    }catch(err){
        console.log("signin error:",err);
        res.status(500).send({
            message:"Internal server error"
        })
    }
    
}