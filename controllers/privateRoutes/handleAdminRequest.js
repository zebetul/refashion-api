const handleAdminRequest = async (req, res, dataBase) => {
  const usersTotal = await dataBase("login").count("userid");

  const usersVerified = await dataBase("users")
    .count("userid")
    .where({ email_verified: true });

  res.json({
    usersTotal: usersTotal[0].count,
    usersVerified: usersVerified[0].count,
  });
};

export default handleAdminRequest;
