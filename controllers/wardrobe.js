import { uploadImageToAWS, processImages } from "./helpers.js";

export const handleNewItemUpload = async function (req, res, dataBase) {
  const {
    title,
    brand,
    section,
    category,
    size,
    condition,
    price,
    description,
    userid,
  } = req.body;

  let colours = req.body.colours;

  // If colours is not an array, convert it to an array
  if (!Array.isArray(colours)) {
    colours = [colours];
  }

  const { images } = req.files;

  // Insert new item into items table in the database
  const item = {
    userid,
    title,
    price: +price,
    description,
    brand,
    category,
    section,
    size,
    colours,
    condition,
  };
  const newItem = await dataBase("items").insert(item).returning("*");

  // Create unique imageKey = 'userid-itemid-imageName'
  const imageKey = `${userid}/item-${newItem[0].itemid}`;

  const processedImages = await processImages(images);

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(
    processedImages,
    "rfsimages",
    imageKey
  );

  if (!imageURL.length)
    return res.status(400).json("Fail to upload image to AWS!");

  // Insert image URL into images table
  const newImages = imageURL.map((url) => ({ itemid: newItem[0].itemid, url }));
  const response = await dataBase("images").insert(newImages);

  const updatedWardrobe = await dataBase("items")
    .select("items.*", dataBase.raw("ARRAY_AGG(images.url) AS images"))
    .leftJoin("images", "items.itemid", "images.itemid")
    .where("items.userid", userid)
    .groupBy("items.itemid");

  if (updatedWardrobe) {
    res.json(updatedWardrobe);
  } else {
    res.status(404).json({ error: "User's wardrobe not found" });
  }
};

export const handleGetUserWardrobe = async function (req, res, dataBase) {
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

export const handleItemUpdate = async function (req, res, dataBase) {
  const { id } = req.params;

  const {
    section,
    category,
    brand,
    size,
    colours,
    condition,
    price,
    title,
    description,
  } = req.body;

  try {
    const updatedItem = await dataBase("items")
      .where("itemid", id)
      .update({
        section,
        category,
        brand,
        size,
        colours,
        condition,
        price,
        title,
        description,
      })
      .returning("*");

    // Add item imges to the updatedItem object
    const images = await dataBase("images").where("itemid", id);
    updatedItem[0].images = images.map((image) => image.url);

    if (updatedItem.length) {
      res.json(updatedItem[0]);
    } else {
      res.status(404).json("Item not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
};
