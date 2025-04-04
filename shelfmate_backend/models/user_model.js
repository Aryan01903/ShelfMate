const mongoose=require("mongoose")



const userSchema=new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true
    },
    savedBooks : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book"
    }],
    ratedBooks : [{
        bookId : mongoose.Schema.Types.ObjectId,
        rating : Number
    }]
}, {
    timestamps : true,  // Automatically adds `createdAt` and `updatedAt`
    versionKey : false  // Disables the `__v` field in the document
})

module.exports = mongoose.model("User",userSchema)