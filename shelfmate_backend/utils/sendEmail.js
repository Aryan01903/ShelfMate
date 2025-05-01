require('dotenv').config({ path: 'G:/Projects/Resume Projects/Book_Recommendation/ShelfMate/shelfmate_backend/utils/.env' });

console.log("MAIL_USER:", process.env.MAIL_USER);  // Should print your email address
console.log("MAIL_PASS:", process.env.MAIL_PASS);  // Should print your password

const nodemailer=require("nodemailer")
const fs = require('fs');
const path = './.env';  // Adjust if .env is in a different folder

if (fs.existsSync(path)) {
    console.log('.env file found!');
} else {
    console.log('.env file NOT found at', path);
}


console.log("MAIL_USER:", process.env.MAIL_USER);
console.log("MAIL_PASS:", process.env.MAIL_PASS ? "✅ Present" : "❌ Missing");

const transporter = nodemailer.createTransport({
    service : "Gmail",
    auth : {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
})

const sendMail=async(to,subject,text)=>{
    const mailOptions={
        from : `"ShelfMate" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    }
    return transporter.sendMail(mailOptions);
}

module.exports=sendMail;


