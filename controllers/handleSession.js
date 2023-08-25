import { getUserFromDB } from "./helpers.js";

const handleSession = async function (req, res, dataBase) {
  const { rfs_session_id } = req.cookies;

  if (!rfs_session_id) return res.json("no session");

  try {
    const session = await dataBase
      .select("*")
      .from("sessions")
      .where("session_id", "=", rfs_session_id)
      .first();

    if (!session) return res.json("session not found");

    const user = await getUserFromDB(session.user_id, dataBase);

    if (!user) return res.json("user not found");

    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json("error getting user");
  }
};

export default handleSession;
