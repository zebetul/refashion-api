const handleGetItems = async function (req, res, dataBase) {
  try {
    const { _page, _limit, _q: searchQuery, _filters, _sort: sort } = req.query;

    const limit = parseInt(_limit);
    const offset = (_page - 1) * limit;
    const filters = JSON.parse(_filters);
    let newMaxPrice = 0;

    // Joining the items and images tables together and extracting them
    let query = dataBase("items")
      .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
      .leftJoin("images", "items.itemid", "images.itemid")
      .groupBy("items.itemid");

    // Apply search query if provided
    if (searchQuery) {
      // The ilike operator is used to perform case-insensitive LIKE comparisons
      query = query.where("items.title", "ilike", `%${searchQuery}%`);
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

      // Extract the maximum price from the items table after applying filters but before applying price filter and convert it to a number before sending it to the client
      const clonedQuery = await query.clone();
      newMaxPrice = +clonedQuery.reduce((acc, item) => {
        if (+item.price > acc) {
          acc = item.price;
        }
        return acc;
      }, 0);

      // Apply price filter if provided
      if (filters.price > 0) {
        query = query.where("items.price", "<=", filters.price);
      }
    }

    // Sorting the items based on the column and order provided by the client
    if (sort) {
      const [column, order] = sort.split(":");
      query = query.orderBy(column, order);
    }

    // Count the total number of items after applying filters and search query and calculate the total number of pages based on the limit and total number of items
    const totalItems = await query.clone();
    const totalPages = Math.ceil(totalItems.length / limit);

    // Apply pagination
    query = query.offset(offset).limit(limit);

    // Execute the query
    const items = await query;

    items
      ? res.json({ items, totalPages, newMaxPrice })
      : res.json("Items not found.");
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Error retrieving items from the database");
  }
};
export default handleGetItems;
