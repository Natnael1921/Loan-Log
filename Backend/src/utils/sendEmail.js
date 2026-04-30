import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Lendify" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1>${code}</h1>
        <p>This code expires in 5 minutes.</p>
      `,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
};