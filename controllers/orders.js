import { getOrders, getConversations, getUserFromDB } from "./helpers.js";

export const handlePostOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.newOrder)
    return res.status(400).json("Missing required fields");

  const { newOrder, newMessage, isSaveDataChecked } = req.body;

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

    // Update user's delivery address if requested
    if (isSaveDataChecked) {
      const {
        buyer_id: userid,
        buyer_first_name: first_name,
        buyer_last_name: last_name,
        buyer_phone: phone,
        buyer_county: county,
        buyer_city: city,
        buyer_street: street,
        buyer_address: address_details,
        buyer_zip_code: zip_code,
      } = newOrder;

      await dataBase("users").where({ userid }).update({
        first_name,
        last_name,
        phone,
        county,
        city,
        street,
        address_details,
        zip_code,
      });
    }

    // Get user from database
    const updatedUser = await getUserFromDB(order[0].buyer_id, dataBase);

    res.json(updatedUser);
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

    // If status is Finalizată flag all item from itemsID array to status 'sold'
    if (status === "Finalizată.") {
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

    const receivedPendingOrdersNr = orders.reduce(
      (acc, order) =>
        order.seller_id === userID &&
        (order.status === "Comandă plasată." ||
          order.status === "În curs de procesare.")
          ? acc + 1
          : acc,
      0
    );

    const sentPendingOrdersNr = orders.reduce(
      (acc, order) =>
        order.buyer_id === userID && order.status === "Expediată."
          ? acc + 1
          : acc,
      0
    );

    res.json({ orders, receivedPendingOrdersNr, sentPendingOrdersNr });
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
