import { getConversations } from "./helpers.js";

const handleExchange = async (req, res, dataBase) => {
  const {
    senderID: sender_id,
    receiverID: receiver_id,
    senderItems: sender_items,
    receiverItems: receiver_items,
    proposerID: proposer_id,
  } = req.body;

  try {
    const exchange = await dataBase("item_exchange").insert({
      sender_id,
      receiver_id,
      sender_items,
      receiver_items,
      proposer_id,
    });

    const conversations = await getConversations(sender_id, dataBase);

    conversations
      ? res.json(conversations)
      : res.status(404).json("🔥🔥🔥 Database not respoding.");
  } catch (err) {
    console.error(err);
    return res.json("Unable to send offer, please try again later.");
  }
};

export default handleExchange;
