// import nodemailer from 'nodemailer';

// async function sendWelcomeEmail(userEmail: string): Promise<void> {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'your-email@gmail.com',
//       pass: 'YOUR_APP_PASSWORD'
//     }
//   });

//   const mailOptions = {
//     from: '"Friendly Name" <your-email@gmail.com>',
//     to: userEmail,
//     subject: 'Welcome to Our Site!',
//     text: 'Hello, thank you for registering on our site. We’re glad to have you with us!',
//     html: '<b>Hello, thank you for registering on our site. We’re glad to have you with us!</b>'
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Message sent: %s', info.messageId);
//   } catch (error) {
//     console.error('Error sending email: ', error);
//   }
// }