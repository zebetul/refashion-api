const handleProfileUpdate = async function (req, res, dataBase) {
  const { id } = req.params;

  try {
    const user = await dataBase("users")
      .update("aboutme", req.body.aboutMe)
      .where("userid", "=", id)
      .returning("*");

    return user.length
      ? // Succes
        res.json(user[0])
      : // User not found
        res.json("Update not successful, user not found");
  } catch (err) {
    // Server error
    res.json("Update not succesfull, please try again later");
  }
};
export default handleProfileUpdate;
