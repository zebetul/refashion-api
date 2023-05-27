import { response } from "express";

const handleMessage = async function (req, res, dataBase) {
  const { senderID, receiverID, content } = req.body;

  // INPUT VALIDATION
  if (!senderID || !receiverID || !content)
    return res.json("Missing required fields.");

  try {
    const response = await dataBase("messages").returning("*").insert({
      sender_id: senderID,
      receiver_id: receiverID,
      content: content,
    });

    return response[0].message_id
      ? res.json(response)
      : res.status(404).json("🔥🔥🔥 Database not respoding.");

    // catching error and sending it if user registration fails
  } catch (err) {
    console.error(err);
    return res.json("Unable to send message, please try again later.");
  }
};
export default handleMessage;
