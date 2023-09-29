import { sendEmailTo } from "./helpers.js";

const handleContactUs = async (req, res, dataBase) => {
  const { email: user_email, message: message_content } = req.body;

  // INPUT VALIDATION
  if (!user_email || !message_content)
    return res.status(401).json("Missing required fields.");

  // Inserting new message_content in contact_us table
  try {
    await sendEmailTo(
      "contact@restil.ro",
      `Mesaj nou de la ${user_email}`,
      message_content
    );

    await dataBase("contact_us").insert({
      user_email,
      message_content,
      timestamp: new Date(),
    });

    console.log(
      // `🟢🟢🟢 Message sent successfully! Here is the response from SES: ${responseFromSes}`
      `🟢🟢🟢 Message sent successfully!`
    );

    return res.status(200).json(
      // `🟢🟢🟢 Message sent successfully. Here is the response from SES: ${responseFromSes}`
      `🟢🟢🟢 Message sent successfully.`
    );
  } catch (err) {
    console.log(`🔥🔥🔥 Server error at ContactUs: ${err.message}`);

    return res
      .status(500)
      .json(`🔥🔥🔥 Server error at ContactUs: ${err.message}`);
  }
};
export default handleContactUs;
