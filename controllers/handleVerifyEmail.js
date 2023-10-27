const handleVerifyEmail = async (req, res, dataBase) => {
  const { session_id } = req.params;

  // INPUT VALIDATION
  if (!session_id)
    return res
      .status(400)
      .json(`🔥🔥🔥 Missing requiered fields: ${err.message}`);

  try {
    const session = await dataBase("sessions").where({ session_id }).first();

    if (!session)
      return res
        .status(404)
        .json(`🔥🔥🔥 Error, session not found: ${err.message}`);

    const response = await dataBase("users")
      .where({ userid: session.user_id })
      .update({ email_verified: true });

    if (!response)
      return res.status(404).json(`🔥🔥🔥 Error updating user: ${err.message}`);

    return res.status(200).json(`Success!`);
  } catch (err) {
    return res
      .status(500)
      .json(`🔥🔥🔥 Server error at VerifyEmail: ${err.message}`);
  }
};
export default handleVerifyEmail;
