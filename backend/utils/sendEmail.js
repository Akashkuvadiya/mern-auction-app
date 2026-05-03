// import nodeMailer from "nodemailer";

// export const sendEmail = async ({ email, subject, message, html }) => {
//     try {
//         console.log("Attempting to send email...");
//         console.log("Using SMTP Host:", process.env.SMTP_HOST);
//         console.log("Using Port:", process.env.SMTP_PORT);
//         console.log("Using Service:", process.env.SMTP_SERVICE);
//         console.log("From Email:", process.env.SMTP_MAIL);

//         const transporter = nodeMailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: process.env.SMTP_PORT,
//             service: process.env.SMTP_SERVICE,
//             secure: true,
//             auth: {
//                 user: process.env.SMTP_MAIL,
//                 pass: process.env.SMTP_PASSWORD,
//             },
//             tls: {
//                 rejectUnauthorized: false // Only for development/testing
//             }
//         });

//         // Verify transporter configuration
//         await transporter.verify();
//         console.log("SMTP connection verified successfully");

//         const mailOptions = {
//             from: `"Auction App" <${process.env.SMTP_MAIL}>`,
//             to: email,
//             subject: subject,
//             text: message,
//             html: `<div>${message}</div>`, // Added HTML support
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email sent successfully:", info.messageId);
//         return true;
//     } catch (error) {
//         console.error("Email sending error details:", {
//             error: error.message,
//             code: error.code,
//             stack: error.stack
//         });
//         throw new Error(`Failed to send email: ${error.message}`);
//     }
// };



import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message, html }) => {  // ← add html
    try {
        const transporter = nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            secure: true,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.verify();

        const mailOptions = {
            from: `"PrimeBid Auctions" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject: subject,
            text: message,
            html: html || `<div>${message}</div>`,  // ← use html if provided
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("Email sending error:", error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};