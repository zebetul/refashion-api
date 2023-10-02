const handleVerifyEmail = async (req, res, dataBase) => {
  const { session_id } = req.params;

  const session = await dataBase("sessions").where({ session_id }).first();

  if (!session) return res.json("session not found");

  const response = await dataBase("users")
    .where({ userid: session.user_id })
    .update({ email_verified: true })
    .first();

  if (!response) return res.json("error updating user");

  res.json("user updated");
};
export default handleVerifyEmail;
