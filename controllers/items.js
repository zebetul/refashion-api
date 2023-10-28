import { deleteImagesFromAWS } from "../utils/helpers.js";

export const handleGetItems = async function (req, res, dataBase) {
  const response = {
    items: [],
    totalPages: 0,
    newMaxPrice: 0,
    topPrice: 0,
  };

  try {
    const { _page, _limit, _q: searchQuery, _filters, _sort: sort } = req.query;

    const limit = parseInt(_limit);
    const offset = (_page - 1) * limit;
    const filters = JSON.parse(_filters);

    // Querry for the biggest price in the items table
    const priceObject = await dataBase("items")
      .select("price")
      .orderBy("price", "desc")
      .limit(1);

    console.log(priceObject);

    response.topPrice = +priceObject[0].price;

    // Joining the items and images tables together and extracting them
    let query = dataBase("items")
      .select(
        "items.*",
        dataBase.raw(
          "(SELECT ARRAY_AGG(images.url ORDER BY images.imageid) FROM images WHERE items.itemid = images.itemid) AS images"
        )
      )
      .groupBy("items.itemid");

    // Apply search query if provided and search in title, category, brand and section
    if (searchQuery) {
      // The ilike operator is used to perform case-insensitive LIKE comparisons
      // The % wildcard matches any string of zero or more characters
      query = query.where(function () {
        this.where("items.title", "ilike", `%${searchQuery}%`)
          .orWhere("items.category", "ilike", `%${searchQuery}%`)
          .orWhere("items.brand", "ilike", `%${searchQuery}%`);
      });
    }

    // Apply filters.
    if (filters) {
      // Apply section filter if provided
      if (filters.sections.length > 0) {
        // The whereIn method is used to specify that the items.section column should match any of the values in the array
        query = query.whereIn("items.section", filters.sections);
      }
      if (filters.categories.length > 0) {
        query = query.whereIn("items.category", filters.categories);
      }
      if (filters.brands && filters.brands.length > 0) {
        query = query.whereIn("items.brand", filters.brands);
      }
      if (filters.sizes && filters.sizes.length > 0) {
        query = query.whereIn("items.size", filters.sizes);
      }
      if (filters.conditions && filters.conditions.length > 0) {
        query = query.whereIn("items.condition", filters.conditions);
      }
      // Check if one of the colours from filters.colours is in the colours array of the item
      if (filters.colours && filters.colours.length > 0) {
        query = query.whereRaw(
          `items.colours && '{"${filters.colours.join('","')}"}'`
        );
      }

      // Extract the maximum price from the items table after applying filters but before applying price filter and convert it to a number before sending it to the client
      const clonedQuery = await query.clone();
      response.newMaxPrice = +clonedQuery.reduce((acc, item) => {
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
      // if there are two or more items with same value in sort criteria, sort them by their id
      query = query.orderBy(column, order).orderBy("items.itemid", "asc");
    }

    // Count the total number of items after applying filters and search query and calculate the total number of pages based on the limit and total number of items
    const totalItems = await query.clone();
    response.totalPages = Math.ceil(totalItems.length / limit);

    // Apply pagination
    query = query.offset(offset).limit(limit);

    // Execute the query
    response.items = await query;

    response.items
      ? res.json(response)
      : res.json(`Something went wrong: ${response}`);
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Error retrieving items from the database");
  }
};

export const handleGetItemById = async function (req, res, dataBase) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.json("Missing request params.");
    }

    // Retrieving the item and its images and userid, username and user image as properties from the database
    const item = await dataBase("items")
      .select(
        "items.*",
        dataBase.raw("ARRAY_AGG(images.url) AS images"),
        "users.userid as sellerID",
        "users.name as sellerName",
        "users.image as sellerImage"
      )
      .leftJoin("images", "items.itemid", "images.itemid")
      .leftJoin("users", "items.userid", "users.userid")
      .groupBy("items.itemid", "users.userid")
      .where("items.itemid", id);

    item ? res.json(item[0]) : res.json("Item not found.");
  } catch (err) {
    console.error(err);
    res.json("🔥🔥🔥 Error retrieving item from the database");
  }
};

export const handleDeleteItem = async function (req, res, dataBase) {
  const { itemID, userID, imagesNr } = req.body;

  try {
    // Delete item from the items table
    const deletedItem = await dataBase("items")
      .where("itemid", itemID)
      .del()
      .returning("*");

    // Delete images from AWS S3 bucket
    const Objects = [];
    for (let i = 0; i < imagesNr; i++) {
      Objects.push({ Key: `${userID}/item-${itemID}/${i}.jpeg` });
    }
    await deleteImagesFromAWS(Objects, "rfsimages");

    if (deletedItem) {
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
