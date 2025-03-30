const User=require("../models/user_model")
const axios=require("axios") //  used for making HTTP requests (API calls)

const Book=require("../models/Book")

exports.searchBooks=async(req,res)=>{
    try{
        const { query }=req.query;
        const response =await axios.get(`https://openlibrary.org/search.json?q=${query}`);
        res.json(response.data.docs);
    }
    catch(error){
        res.status(500).send({
            message : "Error in fetching books"
        })
    }
}
exports.rateBook=async(req,res)=>{
    try{
        const { bookId, rating}=req.body;
        const user =await User.findById(req.user.id);
        if(!user){
            return res.status(404).send({
                message : "User not found"
            })
        }
        user.ratedBooks.push({bookId,rating});
        await user.save();
        res.json({
            message : "Book rated successfully"
        })
    }catch(error){
        res.status(500).send({
            message : "Error in rating book"
        })
    }
}
exports.getRecommendations=async (req,res)=>{
    try{
        const user =await User.findById(req.user.id);
        if(!user){
            return res.status(404).send({
                message : "User not found"
            })
        }
        const ratedBooksIds=user.ratedBooks.map(rb=>rb.bookId);
        const response=await axios.get(`https://openlibrary.org/subjects/${ratedBookIds[0] || "fiction"}.json`)
        res.json(response.data);
    }
    catch(error){
        res.status(500).send({
            message : "Error fetching recommendations"
        })
    }
}


