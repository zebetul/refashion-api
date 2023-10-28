import {
  getUserFromDB,
  deleteImagesFromAWS,
  processImages,
  uploadImageToAWS,
} from "../../utils/helpers.js";

export const handleProfileImageUpload = async function (req, res, dataBase) {
  const { imageFile } = req.files;
  const { userID } = req.body;

  // Create unique imageKey = userID
  const imageKey = `userprofile-${userID}`;

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

export const handleProfileUpdate = async function (req, res, dataBase) {
  const { id } = req.params;
  const { aboutMe, languages, preferredBrand, city, county } = req.body;

  try {
    const data = await dataBase("users")
      .update({
        aboutme: aboutMe,
        languages: languages,
        preferredbrand: preferredBrand,
        city: city,
        county: county,
      })
      .where("userid", "=", id)
      .returning("*");

    const user = await getUserFromDB(data[0].userid, dataBase);

    return res.json(user);
  } catch (err) {
    console.error(err);
    // Server error
    res.status(500).json("🔥🔥🔥Database error: not connecting");
  }
};

export const handleDeleteProfile = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    // Delete all user related images from AWS S3(profile image, item images)
    // 1. Delete items images
    const items = await dataBase("items")
      .select("itemid")
      .where("userid", "=", id);

    const Objects = [];
    items.forEach((item) => {
      for (let i = 0; i < 5; i++) {
        Objects.push({ Key: `${id}/item-${item.itemid}/${i}.jpeg` });
      }
    });
    await deleteImagesFromAWS(Objects, "rfsimages");

    // 2. Delete profile image
    const profileImage = [{ Key: `userprofile-${id}/0.jpeg` }];
    await deleteImagesFromAWS(profileImage, "rfs-user-images");

    // Delete user from the users table
    const user = await dataBase("login")
      .where("userid", "=", id)
      .del()
      .returning("*");

    if (!user.length) return res.json("Database error: user not found");

    // In orders table empty all the user related columns like address, phone, email, but keep the order row
    await dataBase("orders").where("buyer_id", "=", id).update({
      buyer_first_name: null,
      buyer_last_name: null,
      buyer_address: null,
      buyer_phone: null,
      buyer_email: null,
      buyer_county: null,
      buyer_city: null,
      buyer_street: null,
      buyer_zip_code: null,
    });

    res.json("User deleted.");
  } catch (err) {
    console.error(err);
    res.status(500).json("🔥🔥🔥Database error: not connecting");
  }
};
