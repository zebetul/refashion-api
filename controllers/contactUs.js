import { sendEmailTo } from "./helpers.js";

const handleContactUs = async (req, res, dataBase) => {
  const { email: user_email, message: message_content } = req.body;

  // INPUT VALIDATION
  if (!user_email || !message_content)
    return res.status(401).json("Missing required fields.");

  try {
    await sendEmailTo(
      "contact@restil.ro",
      `Mesaj nou de la ${user_email}`,
      `
      <h1 style="font-size: 2rem; margin-bottom: 10px">
        Mesaj nou de la ${user_email}:
      </h1>

      <p>${message_content}</p>`
    );

    await dataBase("contact_us").insert({
      user_email,
      message_content,
      timestamp: new Date(),
    });

    return res.status(200).json(`🟢🟢🟢 Message sent successfully.`);
  } catch (err) {
    return res
      .status(500)
      .json(`🔥🔥🔥 Server error at ContactUs: ${err.message}`);
  }
};
export default handleContactUs;
