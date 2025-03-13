import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

app.post("/send-email", async (req, res) => {
    const {fname, lname, company, tel, email, method, reason} = req.body
    
    try {
        
        const info = await transporter.sendMail({
            from: `"mi - automatic response 🤖" <${process.env.EMAIL}>`, //Sender
            to: `${email}`, // empfänger E-Mail-Adresse // array mit mehreren adressen möglich
            bcc: `${process.env.COPY}`,
            subject: `Hi ${fname} ${lname} - Thank you for reaching out to me 😃`,
            text: `Moin (northern-german for "hi) ${fname} ${lname}, Thank you so much for getting in touch! I’ve received your message and will get back to you shortly. Here’s a quick look at the details you shared, just to keep everything transparent; Name: ${fname} ${lname}, company: ${company}, Phone Number: ${tel}, Email: ${email}, (Method: ${method}), Message: ${reason}. II’ll get back to you within a day or two, but if anything above needs correcting, please feel free to reach me directly at contact.michaels.website@gmail.com. Thanks again, and I look forward to connecting with you soon! Best regards Michael`,
            html: `
            <h2>Moin* ${fname} ${lname},</h2>
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
            <b>Michael 🤓</b>
            <hr/>
            <p>*moin = northern-german for "hi"</p>
            `,
        });

        res.status(200).json({success: true, messageId: info.messageId})
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({success: false, error: "Mail couldn't be sent!"})
    }
    })
    
    
app.listen(PORT, () => {
    console.log(`Server läuft auf Port`, PORT);
})