import axios from "axios";

export const sendVerificationEmail = async (toEmail, code) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_FROM,
          name: "Lendify",
        },
        to: [{ email: toEmail }],
        subject: "Your Verification Code",
        htmlContent: `
          <div style="font-family: Arial; text-align: center;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 5px;">${code}</h1>
            <p>This code expires in 5 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(
      "Brevo Email Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email");
  }
};

export const sendWelcomeEmail = async (toEmail, username) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.EMAIL_FROM,
          name: "Lendify",
        },
        to: [{ email: toEmail }],
        subject: "Welcome to Lendify 🎉",
        htmlContent: `
          <div style="font-family: Arial; text-align: center;">
            <h1>Welcome to Lendify 🎉</h1>
            <p>Hi <b>${username}</b>,</p>
            <p>Your account has been successfully created.</p>
            <p>You can now start tracking loans and balances with your friends.</p>
            <br/>
            <p style="color: #16a34a;">Let’s manage money smarter together 💰</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Welcome Email Error:", error.response?.data || error.message);
  }
};