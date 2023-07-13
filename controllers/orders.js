const handlePostOrder = async (req, res, dataBase) => {
  // Input validation
  if (!req.body.item_id) return res.status(400).json("Missing required fields");

  // error handling
  try {
    const order = await dataBase("orders").insert(req.body).returning("*");

    res.json(order[0]);
  } catch (err) {
    console.log(err);
    res.status(400).json("error posting order");
  }
};
export default handlePostOrder;
