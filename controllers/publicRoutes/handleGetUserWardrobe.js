const handleGetUserWardrobe = async function (req, res, dataBase) {
  const { id } = req.params;
  const { _sort: sort } = req.query;

  try {
    let query = dataBase("items")
      .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
      .leftJoin("images", "items.itemid", "images.itemid")
      .where("items.userid", id)
      .groupBy("items.itemid");

    // Apply sorting if provided
    if (sort) {
      const [column, order] = sort.split(":");
      query = query.orderBy(column, order);
    }

    const wardrobe = await query;

    // Check if the user's wardrobe exists
    if (wardrobe) {
      res.json(wardrobe);
    } else {
      res.status(404).json("User's wardrobe not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};

export default handleGetUserWardrobe;
