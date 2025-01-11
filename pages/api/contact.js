import nodemailer from "nodemailer";

export default async function handler(req, res) {
    console.log('рдлфыовадлыао')
    if (req.method === "POST") {
        const { name, email, message } = req.body;

        // Убедитесь, что все поля заполнены
        if (!name || !email || !message) {
            return res.status(400).json({ error: "All fields are required." });
        }

        try {
            // Настройте Nodemailer
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            // Настройка email-сообщения
            await transporter.sendMail({
                from: `"${name}" <${email}>`, // От кого
                to: process.env.RECEIVER_EMAIL, // Кому
                subject: "New Contact Form Submission", // Тема
                text: message, // Текст письма
                html: `<p><strong>Name:</strong> ${name}</p>
                       <p><strong>Email:</strong> ${email}</p>
                       <p><strong>Message:</strong> ${message}</p>`, // HTML-контент письма
            });

            // Успешный ответ
            res.status(200).json({ message: "Email sent successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error sending email." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
}
