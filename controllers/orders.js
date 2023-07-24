import { getOrders, getConversations } from "./helpers.js";

export const handlePostOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.newOrder)
    return res.status(400).json("Missing required fields");

  const { newOrder, newMessage } = req.body;

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

export const handleUpdateStatus = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.orderId || !req.body.status)
    return res.status(400).json("Missing required fields");

  const { orderId, status, userID } = req.body;

  // error handling
  try {
    await dataBase("orders")
      .where({ order_id: orderId })
      .update({ status, last_status_update: new Date() })
      .returning("*");

    if (req.body.deliveryMethod)
      await dataBase("orders").where({ order_id: orderId }).update({
        delivery_method: req.body.deliveryMethod,
        // update AWB if any
        awb: req.body.awb,
      });

    if (req.body.cancelReason)
      await dataBase("orders").where({ order_id: orderId }).update({
        cancel_reason: req.body.cancelReason,
      });

    const orders = await getOrders(userID, dataBase);

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json("error updating order");
  }
};

export const handleDeleteOrders = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.orderId) return res.status(400).json("Missing required fields");

  const { orderId, userID } = req.body;

  // error handling
  try {
    await dataBase("orders").where({ order_id: orderId }).del();

    const orders = await getOrders(userID, dataBase);

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json("error deleting order");
  }
};
