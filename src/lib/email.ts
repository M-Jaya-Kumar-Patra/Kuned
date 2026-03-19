import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password (NOT your real password)
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Kuned Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return info;

  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Email failed");
  }
}








// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendEmail({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) {
//   try {

//     const data = await resend.emails.send({
//       from: process.env.EMAIL_FROM as string,
//       to: [to], // safer to send as array
//       subject,
//       html,
//     });

//     return data;

//   } catch (error) {

//     console.error("Email send error:", error);
//     throw new Error("Email failed");

//   }
// }