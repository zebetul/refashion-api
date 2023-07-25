import { getOrders, getConversations } from "./helpers.js";

export const handlePostOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.newOrder)
    return res.status(400).json("Missing required fields");

  const { newOrder, newMessage } = req.body;

  // Error handling
  try {
    // Insert new order
    const order = await dataBase("orders").insert(newOrder).returning("*");

    // Insert new message
    const message = await dataBase("messages")
      .insert(newMessage)
      .returning("*");

    // Flag item is_requested to true to all items in the order
    order[0].items_id.forEach(async (item_id) => {
      await dataBase("items")
        .where({ itemid: item_id })
        .update({ status: "is_requested" });
    });

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

  try {
    await dataBase("orders")
      .where({ order_id: orderId })
      .update({ status, last_status_update: new Date() })
      .returning("*");

    if (req.body.deliveryMethod) {
      await dataBase("orders").where({ order_id: orderId }).update({
        delivery_method: req.body.deliveryMethod,
        awb: req.body.awb,
      });
    }

    if (req.body.cancelReason) {
      await dataBase("orders").where({ order_id: orderId }).update({
        cancel_reason: req.body.cancelReason,
      });

      // Flag all item from itemsID array to status available
      const itemsID = await dataBase("orders")
        .select("items_id")
        .where({ order_id: orderId });

      itemsID[0].items_id.forEach(async (item_id) => {
        await dataBase("items")
          .where({ itemid: item_id })
          .update({ status: "" });
      });
    }

    if (status === "Finalizata.") {
      // Flag all item from itemsID array to status 'sold'
      const itemsID = await dataBase("orders")
        .select("items_id")
        .where({ order_id: orderId });

      itemsID[0].items_id.forEach(async (item_id) => {
        await dataBase("items")
          .where({ itemid: item_id })
          .update({ status: "sold" });
      });
    }

    const orders = await getOrders(userID, dataBase);

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json("error updating order");
  }
};

export const handleDeleteOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.orderId) return res.status(400).json("Missing required fields");

  const { orderId, userID, itemsID } = req.body;

  try {
    await dataBase("orders").where({ order_id: orderId }).del();

    // Flag all item from itemsID array to status available
    itemsID.forEach(async (item_id) => {
      await dataBase("items").where({ itemid: item_id }).update({ status: "" });
    });

    const orders = await getOrders(userID, dataBase);

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(400).json("error deleting order");
  }
};
