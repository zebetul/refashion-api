const handleAdminRequest = async (req, res, dataBase) => {
  try {
    const usersTotal = await dataBase("login").count("userid");

    const usersGoogle = await dataBase("login")
      .count("userid")
      .where({ hash: "google" });

    const usersEmailVerified = await dataBase("users")
      .count("userid")
      .where({ email_verified: true });

    const activeSessions = await dataBase("sessions")
      .countDistinct("user_id")
      .where(
        "expires_at",
        ">",
        dataBase.raw("to_timestamp(?)", Date.now() / 1000)
      );

    // Get unique sellers
    const sellers = await dataBase("items").countDistinct("userid");

    res.json({
      usersTotal: usersTotal[0].count,
      usersEmailVerified: usersEmailVerified[0].count,
      usersGoogle: usersGoogle[0].count,
      activeSessions: activeSessions[0].count,
      sellers: sellers[0].count,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(`🔥🔥🔥 Server error at Admin: ${err.message}`);
  }
};

export default handleAdminRequest;
