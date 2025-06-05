import * as functions from "firebase-functions/v1";
import * as nodemailer from "nodemailer";

import * as dotenv from "dotenv";
dotenv.config();
const gmailEmail = process.env.GMAIL_EMAIL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: "bvshnzquwhxzdoxa",
  },
});

export const sendEmailOnAlert = functions.database
  .ref("/sensors/{sensorId}")
  .onCreate(async (snapshot) => {
    const sensor = snapshot.val();
    console.log("New sensor data received:", snapshot);
    console.warn("Sensor data =>", sensor);
    let detectionMessage = "";
    if (sensor?.fire == 1) detectionMessage = "🔥 Fire detected";
    else if (sensor?.gas == 1 ) detectionMessage = "💨 Gas detected";
    const mailOptions = {
      from: `"Alert System" <${gmailEmail}>`,
      to: "swachchha.kh@gmail.com",
      subject: "🚨 Alert",
      text: `${detectionMessage} at ${new Date(Date.now()).toLocaleString("en-AU", {
        timeZone: "Australia/Sydney",
      })}.`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent:", info.response);
      return null;
    } catch (error) {
      console.error("❌ Error sending email:", error);
      return null;
    }
  });
