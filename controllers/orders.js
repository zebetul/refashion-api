import { getOrders, getConversations } from "./helpers.js";

const handlePostOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.newOrder)
    return res.status(400).json("Missing required fields");

  const { newOrder, newMessage } = req.body;

  console.log(newMessage);

  // error handling
  try {
    const order = await dataBase("orders").insert(newOrder).returning("*");

    const message = await dataBase("messages")
      .insert(newMessage)
      .returning("*");

    const orders = await getOrders(order[0].buyer_id, dataBase);

    const conversations = await getConversations(
      message[0].sender_id,
      dataBase
    );

    res.json({ orders, conversations });
  } catch (err) {
    console.log(err);
    res.status(400).json("error posting order");
  }
};
export default handlePostOrder;
