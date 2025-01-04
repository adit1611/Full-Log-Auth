// import Nodemailer from 'nodemailer';
// import { MailtrapTransport, MailtrapClient } from 'mailtrap';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// // Retrieve sensitive values from .env
// export const Mail_Client = new MailtrapClient({
// 	endpoint: process.env.MAILTRAP_HOST,
// 	token: process.env.MAIL_TOKEN,
// }); // Typically "smtp.mailtrap.io"

// // Configure the email transport using Mailtrap
// const transport = Nodemailer.createTransport(
//   MailtrapTransport({
//     token: TOKEN,
//   })
// );

// // Sender details
// export const sender = {
//   address: "hello@demomailtrap.com", // Use a verified email in Mailtrap
//   name: "Mailtrap Test",
// };

// // Recipient(s)
// // const recipients = [
// //   "meena.05021997devi@gmail.com",
// // ];

// // // Email data with template details
// // const mailOptions = {
// //   from: sender, // Sender's information
// //   to: recipients, // Array of recipient(s)
// //   subject: "Welcome", // Subject line
// //   text: "Welcome to EraWorld", // Fallback plain text body
// //   category: "Integrate world", // Optional metadata (useful for tracking)
// //   template_uuid: "0c4216f9-33fd-4e53-a81e-bacd73207fa8", // Template ID from Mailtrap
// //   template_variables: {
// //     company_info_name: "Test_Company_info_name",
// //     name: "Test_Name",
// //     company_info_address: "Test_Company_info_address",
// //     company_info_city: "Test_Company_info_city",
// //     company_info_zip_code: "Test_Company_info_zip_code",
// //     company_info_country: "Test_Company_info_country",
// //   },
// // };

// // // Send the email
// // transport
// //   .sendMail(mailOptions)
// //   .then((info) => {
// //     console.log("Email sent successfully:", info);
// //   })
// //   .catch((error) => {
// //     console.error("Failed to send email:", error.message);
// //   });


import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAILTRAP_HOST,
	token: process.env.MAIL_TOKEN,
});

export const sender = {
	email: "mailtrap@demomailtrap.com",
	name: "Aditya",
};