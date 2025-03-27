const user_model=require("../models/user_model")
const jwt=require("jsonwebtoken")
const auth_config=require("../configs/auth_config")

/**
 * Create a mw that will check if the request body is proper and correct 
 */

const verifySignUpBody=async(req,res,next)=>{
    try{
        // Check for the name 
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed! Name not provided in request body"
            })
        }
        // check for email
        if(!req.body.email){
            return res.status(400).send({
                mesaage : "Failed! Email not provided in the request body"
            })
        }
        // check for userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed! userId not provided in request body"
            })
        }
        // check if the user with the same userId is already present
        const user=await user_model.findOne({userId:req.body.userId})
        if(user){
            return res.status(400).send({
                message : "Failed! user with same userId is already present"
            })
        }

        next()
    }
    catch(err){
        console.log("Error while validating the request object",err)
        res.status(500).send({
            message : "Error while validating the request body"
        })
    }
}

const verifySignInBody=async(req,res,next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message : "password is not provided"
        })
    }
    next()
}

const verifyToken=(req,res,next)=>{
    //Check if the token is present in the header
    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "No token found : UnAuthorized"
        })
    }

    //If it's the valid token
    jwt.verify(token,auth_config.secret ,async (err, decoded)=>{
        if(err){
            return res.status(401).send({
                message : "UnAuthorized !"
            })
        }
        const user = await user_model.findOne({userId : decoded.id})
        if(!user){
            return res.status(400).send({
                message : "UnAuthorized, this user for this token doesn't exist"
            })
        }
        //Set the user info in the req body
        req.user = user
        next()
    } )
}

