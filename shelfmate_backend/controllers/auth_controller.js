const bcryptjs=require("bcryptjs")
const user_model=require("../models/user_model")
const jwt=require("jsonwebtoken")
const secret=require("../configs/auth_config")
const otp_model=require("../models/otp_model")
const sendEmail=require("../utils/sendEmail")
const crypto=require("crypto")

const generateOtp=()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}

// Send OTP to Email (Signup start)
exports.sendOtp=async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).send({
            message : "Email is required"
        })
    }
    try{
        const existingUser=await user_model.findOne({email});
        if(existingUser){
            return res.status(400).send({
                message : "User already exists with this email"
            })
        }
        const otp=generateOtp();
        await otp_model.deleteMany({email}); // clean old OTPs
        await otp_model.create({email,otp}); // save new OTP

        await sendMail(
            email,
            "ShelfMate Signup OTP",
            `Your OTP is ${otp}. It will expire in 2 minutes.`
        );
        return res.status(200).send({
            message : "OTP sent successfully to email"
        })
    }catch(err){
        console.log("OTP send Error: ",err);
        return res.status(500).send({
            message : "Failed to send OTP"
        })
    }
}
// Verify OTP & Register User
exports.verifyOtpAndSignup = async (req, res) => {
    const { email, otp, name, userId, password } = req.body;

    try {
        const otpRecord = await otp_model.findOne({ email });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).send({ message: "Invalid or expired OTP" });
        }

        const hashedPassword = bcryptjs.hashSync(password, 8);

        const newUser = await user_model.create({
            name,
            email,
            userId,
            password: hashedPassword
        });

        await otp_model.deleteMany({ email }); // Clean up OTPs

        return res.status(201).send({
            message: "User registered successfully",
            user: {
                name: newUser.name,
                email: newUser.email,
                userId: newUser.userId,
                createdAt: newUser.createdAt
            }
        });

    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).send({ message: "Registration failed" });
    }
};


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