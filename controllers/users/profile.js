import { getUserFromDB, deleteImagesFromAWS } from "../helpers.js";

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

export const handleProfileGet = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    const user = await dataBase("users").select("*").where("userid", "=", id);

    user.length
      ? res.json(user[0])
      : res.json("Database error: user not found");
  } catch (err) {
    console.error(err);
    res.status(500).json("🔥🔥🔥Database error: not connecting");
  }
};

export const handleDeleteProfile = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    // Delete all user related images from AWS S3(profile image, item images)
    // 1. Delete items images
    // 1.1 Get the itemid of all the items of the user
    const items = await dataBase("items")
      .select("itemid")
      .where("userid", "=", id);

    // 1.2 Delete all the images of the items
    const Objects = [];
    items.forEach((item) => {
      for (let i = 0; i < 5; i++) {
        Objects.push({ Key: `${id}/item-${item.itemid}/${i}.jpeg` });
      }
    });

    await deleteImagesFromAWS(Objects, "rfsimages");

    // 2. Delete profile image that looks like this on the AWS: userprofile-2/0.jpeg
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
