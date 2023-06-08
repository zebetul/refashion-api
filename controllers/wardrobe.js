import { uploadImageToAWS } from "./helpers.js";

const handleNewItem = async function (req, res, dataBase) {
  const { title, brand, category, size, price, description, userid } = req.body;
  const { images } = req.files;

  // Insert new item into items table in the database
  const item = {
    userid,
    title,
    price,
    description,
    brand,
    category,
    size,
  };
  const newItem = await dataBase("items").insert(item).returning("*");

  // Create unique imageKey = 'userid-itemid-imageName'
  const imageKey = `${userid}/item-${newItem[0].itemid}`;

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(images, "rfsimages", imageKey);

  if (!imageURL.length)
    return res.status(400).json("Fail to upload image to AWS!");

  // Insert image URL into images table
  const newImages = imageURL.map((url) => ({ itemid: newItem[0].itemid, url }));
  const response = await dataBase("images").insert(newImages);

  res.json({
    ...newItem[0],
    images: imageURL,
  });
};
export default handleNewItem;
