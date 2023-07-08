import { getConversations } from "./helpers.js";

const handleMessage = async function (req, res, dataBase) {
  const {
    senderID,
    receiverID,
    content,
    senderName,
    receiverName,
    exchangeOffer,
  } = req.body;

  const {
    senderItems: sender_items,
    receiverItems: receiver_items,
    proposerID: proposer_id,
  } = exchangeOffer;

  // INPUT VALIDATION
  if (!senderID || !receiverID || !content || !senderName || !receiverName)
    return res.json("Missing required fields.");

  try {
    const data = await dataBase("messages")
      .insert({
        sender_id: senderID,
        receiver_id: receiverID,
        sender_name: senderName,
        receiver_name: receiverName,
        content: content,
      })
      .returning("*");

    if (sender_items.length || receiver_items.length) {
      const exchange = await dataBase("item_exchange").insert({
        sender_id: senderID,
        receiver_id: receiverID,
        sender_items,
        receiver_items,
        proposer_id,
      });
    }

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
