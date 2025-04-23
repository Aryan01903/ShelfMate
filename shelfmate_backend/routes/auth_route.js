const authController=require("../controllers/auth_controller")

const authMW=require("../middlewares/auth_mw")
const express=require("express");

const router=express.Router();
router.post("/signup",[authMW.verifySignUpBody],authController.signup)
router.post("/signin",[authMW.verifySignInBody],authController.signin)

module.exports=(app)=>{
    app.use("/shelfmate/api/auth",router)
}
