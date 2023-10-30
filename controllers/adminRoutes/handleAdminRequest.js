const handleAdminRequest = async (req, res, dataBase) => {
  try {
    const usersTotal = await dataBase("login").count("userid");

    const usersEmailVerified = await dataBase("users")
      .count("userid")
      .where({ email_verified: true });

    const usersGoogle = await dataBase("login")
      .count("userid")
      .where({ password: "google" });

    res.json({
      usersTotal: usersTotal[0].count,
      usersEmailVerified: usersEmailVerified[0].count,
      usersGoogle: usersGoogle[0].count,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(`🔥🔥🔥 Server error at Admin: ${err.message}`);
  }
};

export default handleAdminRequest;
