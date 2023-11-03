import newMessageReceivedHTMLMarkup from "../../constants/htmlMarkups/newMessageReceivedHTMLMarkup.js";
import { getConversations, sendEmailTo } from "../../utils/helpers.js";

export const handleMessage = async function (req, res, dataBase) {
  const { senderID, receiverID, content, senderName, receiverName } = req.body;

  // INPUT VALIDATION
  if (!senderID || !receiverID || !content || !senderName || !receiverName)
    return res.json("Missing required fields.");

  try {
    // Insert message into database
    await dataBase("messages")
      .insert({
        sender_id: senderID,
        receiver_id: receiverID,
        sender_name: senderName,
        receiver_name: receiverName,
        content: content,
      })
      .returning("*");

    // Get conversations to send back to client
    const conversations = await getConversations(senderID, dataBase);

    // Get receiver email
    const receiver = await dataBase("login")
      .select("email")
      .where({ userid: receiverID });

    const receiverEmail = receiver[0].email;

    // Send email to receiver
    sendEmailTo(
      receiverEmail,
      `Mesaj nou de la ${senderName}`,
      newMessageReceivedHTMLMarkup(senderName, content)
    );

    conversations
      ? res.json(conversations)
      : res.status(404).json("🔥🔥🔥 Database not respoding.");
  } catch (err) {
    console.error(err);
    return res.json("Unable to send message, please try again later.");
  }
};

export const markMessagesAsRead = async function (req, res, dataBase) {
  const { userID } = req.body;

  // INPUT VALIDATION
  if (!userID) return res.json("Missing required fields.");

  try {
    await dataBase("messages")
      .where({ receiver_id: userID })
      .update({ read: true });

    return res.json("Success");
  } catch (err) {
    console.error(err);
    return res.json(
      "Unable to load conversations from server, please try again later."
    );
  }
};
