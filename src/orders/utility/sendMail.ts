// utils/sendMail.js
const axios = require("axios");

// Reusable mail function
async function sendMail({ to, subject, html }) {
  try {
    const response = await axios.post("https://app.smtpprovider.com/api/send-mail/", {
      to,
      from: "info@sharontelematics.org",
      from_name: "ARK",
      subject,
      body: html,
      token: "19a04d6ae3e382a86229740a17307c22"
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error("Mail send error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = sendMail;
