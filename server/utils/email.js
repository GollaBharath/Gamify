const nodemailer  = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async(to,subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_PASS,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}

module.exports  = sendEmail;