import nodemailer from "nodemailer";

const handleContactUs = async (req, res, dataBase) => {
  const { email: user_email, message: message_content } = req.body;

  // INPUT VALIDATION
  if (!user_email || !message_content)
    return res.status(400).json("Missing required fields.");

  // Send email to contact@restil.ro
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Use the email service (e.g., Gmail, Outlook)
    auth: {
      user: "sebenicristi@gmail.com", // Your email address
      pass: process.env.GOOGLE_EMAIL_PASS, // Your email password
    },
  });

  // Email data
  const mailOptions = {
    from: "sebenicristi@gmail.com", // Sender's email address
    to: "contact@restil.ro", // Recipient's email address
    subject: `You got a message from: ${user_email}`, // Email subject
    text: message_content, // Email body (text)
    // You can also use `html` property for HTML content
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });

  // Inserting new message_content in contact_us table
  try {
    await dataBase("contact_us").insert({
      user_email: user_email,
      message_content: message_content,
      timestamp: new Date(),
    });

    return res.json("Message sent successfully");
  } catch (err) {
    console.log(err);
    return res.status(400).json("Unable to send message");
  }
};

export default handleContactUs;
