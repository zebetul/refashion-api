const handleGetItems = async function (req, res, dataBase) {
  try {
    const { _page, _limit, _q: q, _filters, _sort: sort } = req.query;

    const limit = parseInt(_limit);
    const offset = (_page - 1) * limit;
    const filters = JSON.parse(_filters);

    // Joining the items and images tables together and extracting them
    let query = dataBase("items")
      .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
      .leftJoin("images", "items.itemid", "images.itemid")
      .groupBy("items.itemid")
      .orderBy("items.itemid");

    // Apply search query if provided
    if (q) {
      // The ilike operator is used to perform case-insensitive LIKE comparisons
      query = query.where("items.title", "ilike", `%${q}%`);
    }

    // Apply filters. The whereIn method is used to specify that the items.category column should match any of the values in the array
    if (filters) {
      if (filters.categories.length > 0) {
        query = query.whereIn("items.category", filters.categories);
      }
      if (filters.brands && filters.brands.length > 0) {
        query = query.whereIn("items.brand", filters.brands);
      }
      if (filters.sizes && filters.sizes.length > 0) {
        query = query.whereIn("items.size", filters.sizes);
      }
      if (filters.price > 0) {
        query = query.where("items.price", "<=", filters.price);
      }
    }

    // Count the total number of items after applying filters and search query
    const total = await query.clone();

    const totalPages = Math.ceil(total.length / limit);

    // Apply pagination
    query = query.offset(offset).limit(limit);

    // Execute the query
    const items = await query;

    items ? res.json({ items, totalPages }) : res.json("Items not found.");
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Error retrieving items from the database");
  }
};
export default handleGetItems;
