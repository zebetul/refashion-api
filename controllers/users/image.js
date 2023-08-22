import { processImages, uploadImageToAWS } from "../helpers.js";

const handleProfileImageUpload = async function (req, res, dataBase) {
  const { imageFile } = req.files;
  const { userID } = req.body;

  // Create unique imageKey = userID
  const imageKey = `userprofile-${userID}`;

  console.log("imageFile: ", imageFile);

  // Process image with sharp library. Resize to 600x800 pixels and convert to jpeg with 80% quality.
  const processedImage = await processImages(imageFile);

  // Upload image to AWS S3 rfsimages bucket and get the URL
  const imageURL = await uploadImageToAWS(
    processedImage,
    "rfs-user-images",
    imageKey
  );

  if (typeof imageURL[0] !== "string")
    return res.status(400).json("🔥🔥🔥 Fail to upload image to AWS!");

  // Insert image URL in database in users table
  const user = await dataBase("users")
    .update({
      image: imageURL[0],
    })
    .where("userid", "=", userID)
    .returning("*");

  // Returning image URL
  res.json(user[0].image);
};
export default handleProfileImageUpload;
