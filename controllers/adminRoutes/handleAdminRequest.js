const handleAdminRequest = async (req, res, dataBase) => {
  try {
    const usersTotal = await dataBase("login").count("userid");

    const usersEmailVerified = await dataBase("users")
      .count("userid")
      .where({ email_verified: true });

    const usersGoogle = await dataBase("login")
      .count("userid")
      .where({ hash: "google" });

    const activeSessions = await dataBase("sessions")
      .count("session_id")
      .where("expires_at", ">", Date.now());

    res.json({
      usersTotal: usersTotal[0].count,
      usersEmailVerified: usersEmailVerified[0].count,
      usersGoogle: usersGoogle[0].count,
      activeSessions: +activeSessions[0].count,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(`🔥🔥🔥 Server error at Admin: ${err.message}`);
  }
};

export default handleAdminRequest;
