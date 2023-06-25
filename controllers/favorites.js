export const handleAddToFavorites = async function (req, res, dataBase) {
  const { userID: userid, itemID: itemid } = req.body;

  // input validation
  if (!userid || !itemid) return res.json("Missing required fields.");

  try {
    const response = await dataBase("favorites")
      .insert({
        userid,
        itemid,
      })
      .returning("*");

    if (response[0].userid) return res.json("success");
    else return res.status(404).json("🔥🔥🔥 Database not respoding.");
  } catch {
    (err) => res.status(400).json("unable to add to favorites");
  }
};

export const handleDeleteFavorites = async function (req, res, dataBase) {
  const { userID: userid, itemID: itemid } = req.body;

  // input validation
  if (!userid || !itemid) return res.json("Missing required fields.");

  try {
    const response = await dataBase("favorites")
      .where({
        userid,
        itemid,
      })
      .del()
      .returning("*");

    if (response[0].userid) return res.json("success");
    else return res.status(404).json("🔥🔥🔥 Database not respoding.");
  } catch {
    (err) => res.status(400).json("unable to delete from favorites");
  }
};

export const handleGetFavorites = async function (req, res, dataBase) {
  const { id } = req.params;
  const { _sort: sort } = req.query;

  // input validation
  if (!id) return res.json("Missing required fields.");

  try {
    const itemIDs = await dataBase("favorites").select("itemid").where({
      userid: id,
    });

    let query = dataBase("items")
      .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
      .leftJoin("images", "items.itemid", "images.itemid")
      .whereIn(
        "items.itemid",
        itemIDs.map((item) => item.itemid)
      )
      .groupBy("items.itemid");

    // Apply sorting if provided
    if (sort) {
      const [column, order] = sort.split(":");
      query = query.orderBy(column, order);
    }

    const items = await query;

    if (items) {
      return res.json(items);
    } else return res.status(404).json("🔥🔥🔥 Database not respoding.");
  } catch {
    (err) => res.status(400).json("unable to get favourites");
  }
};
