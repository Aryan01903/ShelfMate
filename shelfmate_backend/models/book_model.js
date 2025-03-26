const mongoose=require("mongoose");


const bookSchema=new mongoose.schema({
    title : String,
    author : String,
    cover_url : String,
    user : {type : mongoose.Schema.Types.ObjectId, ref : User}
})

module.exports = mongoose.model("Book",bookSchema)