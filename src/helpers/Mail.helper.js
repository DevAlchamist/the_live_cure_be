const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "nk105000@gmail.com",
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendMail = async function ({ to, subject, text, html, amp }) {
    const info = await transporter.sendMail({
        from: '"The Live Cure" <nk105000@gmail.com>',
        to: to,
        subject,
        text,
        html,
    });
    console.log("Message sent: %s", info.messageId);

    return info;
};

module.exports = { sendMail };
