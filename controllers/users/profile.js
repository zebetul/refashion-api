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
      })
      .where("userid", "=", id)
      .returning("*");

    const messagesSent = await dataBase("messages")
      .select("*")
      .where("sender_id", "=", id);

    const messagesReceived = await dataBase("messages")
      .select("*")
      .where("receiver_id", "=", id);

    const response = {
      ...user[0],
      messagesSent: messagesSent,
      messagesReceived: messagesReceived,
    };

    return user.length
      ? // Succes
        res.json(response)
      : // User not found
        res.json("Update not successful, user not found");
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