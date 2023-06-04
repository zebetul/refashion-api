import { uploadImageToAWS } from "./helpers.js";

const handleNewItem = async function (req, res, dataBase) {
  const { title, brand, category, size, price, description, userid } = req.body;
  const { image } = req.files;

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
  const imageKey = `${userid}-${newItem[0].itemid}-${image.name}`;

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(image, "rfsimages", imageKey, {
    itemID: newItem[0].itemid,
  });

  // Insert image URL into images table
  const newImage = {
    itemid: newItem[0].itemid,
    url: imageURL,
  };
  const response = await dataBase("images").insert(newImage);

  res.json({
    ...newItem[0],
    image: imageURL,
  });
};
export default handleNewItem;
