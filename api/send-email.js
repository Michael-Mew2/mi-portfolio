import nodemailer from "nodemailer";

export default async function (req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { fname, lname, company, tel, email, method, reason } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"mi - automatic response 🤖" <${process.env.EMAIL}>`,
      to: email,
      bcc: [process.env.COPY, process.env.EMAIL],
      subject: `Hi ${fname} ${lname} - Thank you for reaching out to me 😃`,
      text: `Hello ${fname} ${lname}, ...`, // Verkürzte E-Mail
      html: `<h2>Hello ${fname} ${lname},</h2><p>Thank you for reaching out...</p>`,
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Mail couldn't be sent!" });
  }
}
