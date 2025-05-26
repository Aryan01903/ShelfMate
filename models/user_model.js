const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
    },
    password : {
        type : String,
        required : true,
        select : false, // ensure no leakage of password
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    savedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
    ratedBooks: [{
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        },
        rating: {
            type: Number,
            min: 0,
            max: 5
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model("User", userSchema);
