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
      from: `"mi (michael's internet-Portfolio) - automatic response 🤖" <${process.env.EMAIL}>`,
      to: email,
      bcc: [process.env.COPY, process.env.EMAIL],
      subject: `Hi ${fname} ${lname} - Thank you for reaching out to me 😃`,
            text: `Moin (northern-german for "hi) ${fname} ${lname}, Thank you so much for getting in touch! I’ve received your message and will get back to you shortly. Here’s a quick look at the details you shared, just to keep everything transparent; Name: ${fname} ${lname}, company: ${company}, Phone Number: ${tel}, Email: ${email}, (Method: ${method}), Message: ${reason}. II’ll get back to you within a day or two, but if anything above needs correcting, please feel free to reach me directly at contact.michaels.website@gmail.com. Thanks again, and I look forward to connecting with you soon! Best regards Michael`,
            html: `
            <h2>Moin (= northern-german for "hi") ${fname} ${lname},</h2>
            <p>Thank you so much for getting in touch! I’ve received your message and will get back to you shortly. Here’s a quick look at the details you shared, just to keep everything transparent:</p>
            <ul>
            <li><strong>Name:</strong> ${fname} ${lname},</li>
            <li><strong>Company:</strong> ${company},</li>
            <li><strong>Phone Number:</strong> ${tel},</li>
            <li><strong>Email:</strong> ${email},</li>
            <li>(<strong>Prefered Contact Method:</strong> ${method}),</li>
            <li><strong>Message:</strong> ${reason}.</li>
            </ul>
            <p>I’ll get back to you within a day or two, but if anything above needs correcting, please feel free to reach me directly at <a href="mailto:contact.michaels.website@gmail.com">contact.michaels.website@gmail.com</a>.</p>
            <p>Thanks again, and I look forward to connecting with you soon!</p>
            <p>Best regards</p>
            <b>Michael 🤓</b>`,
    });

    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Mail couldn't be sent!" });
  }
}
