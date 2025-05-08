// lib/mailer.ts
import nodemailer from "nodemailer";

export async function sendCodeEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"GameStore" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: "Tu código de compra",
    text: `¡Gracias por tu compra! Tu código es: ${code}`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>¡Gracias por tu compra!</h2>
        <p>Tu código es:</p>
        <h3 style="color: #7C4D64;">${code}</h3>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
