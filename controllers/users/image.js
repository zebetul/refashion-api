import { uploadImageToAWS } from "../helpers.js";

const handleImageUpload = async function (req, res, dataBase) {
  const { imageFile } = req.files;
  const { userID } = req.body;

  // Create unique imageKey = userID
  const imageKey = `${userID}`;

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(
    imageFile,
    "rfs-user-images",
    imageKey
  );

  // Insert image URL in database in users table
  const user = await dataBase("users")
    .update({
      image: imageURL,
    })
    .where("userid", "=", userID)
    .returning("*");

  // Returning image URL
  res.json(user[0].image);
};
export default handleImageUpload;
