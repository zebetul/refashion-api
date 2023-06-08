const handleGetAllItems = async function (req, res, dataBase) {
  try {
    // Joining the items and images tables together and extracting them
    const items = await dataBase("items")
      .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
      .leftJoin("images", "items.itemid", "images.itemid")
      .groupBy("items.itemid");

    items.length ? res.json(items) : res.json("Database responding with error");
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Database not responding");
  }
};
export default handleGetAllItems;
