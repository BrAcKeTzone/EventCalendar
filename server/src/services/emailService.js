const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "DILG R9 OTP service",
    to: email,
    subject: "Calendar Event Service: Your One-Time Passcode (OTP)",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="background-color: #f5f5f5; padding: 10px; border-radius: 5px;">${otp}</h1>
      </body>
    </html>
  `,
  };

  try {
     await transporter.sendMail(mailOptions);
     console.log("Email sent successfully");
    //console.log(otp);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendOTPEmail };
