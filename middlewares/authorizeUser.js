import { dataBase } from "../config.js";

/**
 * Authenticate user based on sessionID cookie if it exists in the database
 * @param {Object} dataBase database object
 * @returns {Object} response object with error message if the user is not authenticated or next() if the user is authenticated
 * @author Cristi Sebeni
 **/
const authorizeUser = async function (req, res, next) {
  const { rfs_session_id } = req.cookies;

  if (!rfs_session_id) {
    return res.status(401).json("Unauthorized");
  }

  // Check if the sessionID is in the database
  const session = await dataBase("sessions")
    .select("*")
    .where("session_id", "=", rfs_session_id)
    .first();

  if (!session) {
    return res.status(401).json("Unauthorized");
  }

  next();
};

export default authorizeUser;
