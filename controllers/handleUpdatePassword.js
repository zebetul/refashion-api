const handleUpdatePassword = async function (req, res, db, bcrypt) {
  const { token } = req.params;
  const { password } = req.body;

  // Check if token and password are provided
  if (!token || !password) {
    return res.json("Missing token or password");
  }

  try {
    // Get token from database
    const tokenFromDB = await db("tokens")
      .select("*")
      .where("token", "=", token)
      .first();

    // If token doesn't exist, return error message
    if (!tokenFromDB) return res.json("Token not found");

    // Get user from database
    const user = await db("login")
      .select("*")
      .where("userid", "=", tokenFromDB.user_id)
      .first();

    // If user doesn't exist, return error message
    if (!user) return res.json("User not found");

    console.log(password);

    // Hashing provided password
    const hash = bcrypt.hashSync(password, 10);

    // Update user's password
    await db("login").where("userid", "=", user.usreid).update({ hash });

    // Delete token
    await db("tokens").where("token", "=", token).del();

    // Return success message
    return res.json("success");
  } catch (err) {
    console.log(err);

    // Return error message
    return res
      .status(500)
      .json(`🔥🔥🔥 Server error at update_password: ${err.message}`);
  }
};

export default handleUpdatePassword;
