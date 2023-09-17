import nodemailer from "nodemailer";

const handleContactUs = async (req, res, dataBase) => {
  const { email: user_email, message: message_content } = req.body;

  // INPUT VALIDATION
  if (!user_email || !message_content)
    return res.status(400).json("Missing required fields.");

  // Send email to contact@restil.ro
  const transporter = nodemailer.createTransport({
    SES: {
      // Your AWS SES region
      region: "eu-west-1",
      // Your AWS access key
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      // Your AWS secret access key
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Email data
  const mailOptions = {
    from: "contact@restil.ro",
    to: "sebenicristi@gmail.com", // Replace with the recipient's email address
    subject: `New message from ${user_email}`,
    text: message_content,
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
