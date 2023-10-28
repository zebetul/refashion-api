import { dataBase } from "../config.js";

const authorizeAdmin = async (req, res, next) => {
  const { rfs_session_id } = req.cookies;

  const userID = await dataBase("sessions")
    .select("user_id")
    .where("session_id", "=", rfs_session_id)
    .first();

  const userEmail = await dataBase("login")
    .select("*")
    .where("userid", "=", userID.user_id)
    .first();

  console.log(userEmail);

  if (userEmail.email !== process.env.ADMIN_EMAIL)
    return res.status(401).json("Unauthorized");

  next();
};

export default authorizeAdmin;
