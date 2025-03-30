const authController=require("../controllers/auth_controller")

const authMW=require("../Middlewares/auth_mw")

module.exports=(app)=>{
    app.post("shelfmate/api/auth/signup",[authMW.verifySignUpBody],authController.signup)


    app.post("shelfmate/api/auth/signin",[authMW.verifySignInBody],authController.signin)
}