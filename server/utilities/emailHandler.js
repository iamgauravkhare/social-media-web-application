const nodemailer = require("nodemailer");

const emailHandler = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      port: 465,
      secure: false,
    });
    const response = await transporter.sendMail({
      from: `WebDev World | WebDev World Pvt. Ltd. - <${process.env.MAIL_USER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    return response;
  } catch (error) {
    console.error(error);
    console.log("Error occured while sending email 🥲.....");
    return error.message;
  }
};

module.exports = emailHandler;
