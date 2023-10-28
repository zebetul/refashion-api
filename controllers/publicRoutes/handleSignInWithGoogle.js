import {
  validateGoogleToken,
  getUserFromDB,
  newSession,
} from "../../utils/helpers.js";

const handleSignInWithGoogle = async function (req, res, dataBase) {
  let payload;
  const { token } = req.body;

  if (!token) return res.status(400).json("Missing token");

  // Token validation
  try {
    payload = await validateGoogleToken(token);
  } catch (err) {
    console.log(err);
    return res.status(400).json("Token verification failed");
  }

  const { email, email_verified, name, given_name, family_name, picture } =
    payload;

  // CHECK IF USER ALREADY EXISTS
  const data = await dataBase("login").select("*").where("email", "=", email);

  // CASE 1. User registered with email and password
  if (data.length > 0 && data[0].hash !== "google") {
    return res.json(email);
  }

  // CASE 2. User allready registered with google account
  if (data.length > 0 && data[0].hash === "google") {
    // update the user's last login time
    await dataBase("users")
      .update({
        last_loggedin: new Date(),
      })
      .where("userid", "=", data[0].userid);
  }

  // CASE 3. User doesn't exist, create new user and return it
  if (data.length === 0) {
    const trx = await dataBase.transaction();

    try {
      // Creating the new user in the database
      const newUser = await trx("login").returning("*").insert({
        email: email,
        hash: "google",
      });

      const data = await trx("users").returning("*").insert({
        userid: newUser[0].userid,
        name,
        first_name: given_name,
        last_name: family_name,
        email,
        email_verified,
        joined: new Date(),
        image: picture,
      });
      await trx.commit();

      // Error handling
    } catch (err) {
      await trx.rollback();
      return res.status(400).json("Unable to register");
    }
  }

  // Retreiving the new user from the database
  const response = await getUserFromDB(data[0].userid, dataBase);

  // Create a session for the user
  const session = await newSession(data[0].userid, dataBase);

  const { session_id, expires_at } = session;

  // Set the session cookie
  res.cookie("rfs_session_id", session_id, {
    httpOnly: true,
    sameSite: "Lax",
    secure: true,
    domain: ".restil.ro",
    expires: expires_at,
    path: "/",
  });

  return res.json(response);
};
export default handleSignInWithGoogle;
