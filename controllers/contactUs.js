import { sendEmailTo } from "./helpers.js";

const handleContactUs = async (req, res, dataBase) => {
  const { email: user_email, message: message_content } = req.body;

  // INPUT VALIDATION
  if (!user_email || !message_content)
    return res.status(400).json("Missing required fields.");

  // Inserting new message_content in contact_us table
  try {
    sendEmailTo(user_email, message_content);

    await dataBase("contact_us").insert({
      user_email,
      message_content,
      timestamp: new Date(),
    });

    return res.json("Message sent successfully");
  } catch (err) {
    console.log(err);

    return res.status(400).json("Unable to send message");
  }
};
export default handleContactUs;
