import transporter from "./nodemailer";
import nodemailer from "nodemailer";

export async function sendResetEmail(to, resetUrl) {
    const mailOptions = {
        from: `"Prodemy" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset.</p>
           <p>Click this link to reset: <a className="py-2 px-4 bg-[#27AE60]" href="${resetUrl}">Reset password</a></p>
           <p>Link expires in 15 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
