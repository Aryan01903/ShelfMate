const mongoose=require("mongoose");


const bookSchema=new mongoose.Schema({
    openLibraryId: { 
        type: String, 
        required: true, 
        unique: true 
    }, // Open Library ID
    title: { 
        type: String, 
        required: true 
    },
    authors: { 
        type: [String], 
        default: ["Unknown"] 
    },
    description: { 
        type: String, 
        default: "No description available" 
    },
    coverImage: { 
        type: String, 
        default: "https://via.placeholder.com/150" 
    },
    subjects: { 
        type: [String], 
        default: ["Uncategorized"] 
    },
    link: { 
        type: String 
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }, // User who added the book
    ratings : [{
        userId : mongoose.Schema.Types.ObjectId,
        rating : Number,
        review : String
    }],
    averageRating : {
        type : Number,
        default : 0
    } 
}, { timestamps: true })

module.exports = mongoose.model("Book",bookSchema)