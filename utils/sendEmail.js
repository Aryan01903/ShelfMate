require("dotenv").config();

const nodemailer=require("nodemailer")
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


