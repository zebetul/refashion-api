export const handleProfileUpdate = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    const user = await dataBase("users")
      .update({
        aboutme: req.body.aboutMe,
        languages: req.body.languages,
        preferredbrand: req.body.preferredBrand,
        city: req.body.city,
        birthdate: req.body.birthDate,
        image: req.body.image,
      })
      .where("userid", "=", id)
      .returning("*");

    return user.length
      ? // Succes
        res.json(user[0])
      : // User not found
        res.json("Update not successful, user not found");
  } catch (err) {
    console.error(err);
    // Server error
    res.json("Update not succesfull, please try again later");
  }
};

export const handleGetSeller = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    const seller = await dataBase("users").select("*").where("userid", "=", id);

    seller.length
      ? res.json(seller[0])
      : res.json("Database error: user not found");
  } catch (err) {
    console.log(err);
    res.json("Database error: not connecting");
  }
};
