import { getConversations } from "./helpers.js";

const handleMessage = async function (req, res, dataBase) {
  const { senderID, receiverID, content, senderName, receiverName } = req.body;

  // INPUT VALIDATION
  if (!senderID || !receiverID || !content || !senderName || !receiverName)
    return res.json("Missing required fields.");

  try {
    const data = await dataBase("messages").insert({
      sender_id: senderID,
      receiver_id: receiverID,
      sender_name: senderName,
      receiver_name: receiverName,
      content: content,
    });

    const conversations = await getConversations(senderID, dataBase);

    conversations
      ? res.json(conversations)
      : res.status(404).json("🔥🔥🔥 Database not respoding.");

    // catching error and sending it if user registration fails
  } catch (err) {
    console.error(err);
    return res.json("Unable to send message, please try again later.");
  }
};
export default handleMessage;
