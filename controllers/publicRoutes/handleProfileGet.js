const handleProfileGet = async function (req, res, dataBase) {
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

export default handleProfileGet;
