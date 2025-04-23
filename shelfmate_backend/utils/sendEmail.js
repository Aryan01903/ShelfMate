const nodemailer=require("nodemailer")
require('dotenv').config({ path: '../configs/mail.env' });
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS
    }
})

const sendMail=async(to,subject,text)=>{
    const mailOptions={
        from : `"ShelMate" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    }
    return transporter.sendMail(mailOptions);
}

module.exports=sendMail;


