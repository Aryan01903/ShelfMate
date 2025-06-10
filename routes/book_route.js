const bookController=require("../controllers/book_controller");
const authMW=require("../middlewares/auth_mw")
const express=require("express");

module.exports=(app)=>{

    const router=express.Router()

    // search books
    router.get("/search",bookController.searchBooks);

    // rate book from 1-5
    router.post("/rate",authMW.verifyToken,bookController.rateBook);
    app.use("/shelfmate/api/books",router);
}




