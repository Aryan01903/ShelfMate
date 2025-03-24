const mongoose=require("mongoose")



const userSchema=new mongoose.Schema({
    name : {
        type : String,
        require : true
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
    }
}, {
    timestamps : true,  // Automatically adds `createdAt` and `updatedAt`
    versionKey : false  // Disables the `__v` field in the document
})

module.exports = mongoose.model("User",userSchema)