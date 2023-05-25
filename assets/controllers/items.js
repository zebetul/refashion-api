const handleItemsFetch = async function (req, res, dataBase) {
  try {
    // Joining the items and images tables together and extracting them
    const items = await dataBase("items")
      .select("items.*", "images.url AS image")
      .leftJoin("images", "items.itemid", "images.itemid");

    items.length ? res.json(items) : res.json("Database responding with error");
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Database not responding");
  }
};

export default handleItemsFetch;
