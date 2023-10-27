const handleSignOut = async (req, res, dataBase) => {
  const { rfs_session_id } = req.cookies;

  if (!rfs_session_id) return res.json("no session");

  try {
    await dataBase("sessions").where("session_id", "=", rfs_session_id).del();
    res.clearCookie("rfs_session_id");
    res.json("session deleted");
  } catch (err) {
    console.log(err);
    res.status(400).json("error deleting session");
  }
};

export default handleSignOut;
