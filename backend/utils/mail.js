const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

async function SendMail(to, sender, project) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: project,
      text: `You have been added to project ${project} by ${sender}`,
    });

    console.log("Message sent:", info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);

    if (previewUrl) {
      console.log("Preview URL:", previewUrl);
    }

  } catch (error) {
    console.log("Email failed:", error);
  }
}

module.exports = { SendMail };