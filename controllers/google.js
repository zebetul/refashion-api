import { validateGoogleToken, getUserFromDB } from "./helpers.js";

const handleToken = async function (req, res, dataBase) {
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

  const { email, name, picture } = payload;

  // Checking if user exists in database
  const data = await dataBase("login").select("*").where("email", "=", email);

  // CASE 1. User doesn't exist, create new user and return it
  if (data.length === 0) {
    const trx = await dataBase.transaction();

    try {
      // Creating and returning the new user from the database
      const newUser = await trx("login").returning("*").insert({
        email: email,
        hash: "google",
      });

      const data = await trx("users").returning("*").insert({
        userid: newUser[0].userid,
        name: name,
        email: email,
        joined: new Date(),
        image: picture,
      });
      await trx.commit();

      // Retreiving the new user from the database
      const response = await getUserFromDB(data[0].userid, dataBase);

      return res.json(response);

      // Error handling
    } catch (err) {
      await trx.rollback();
      return res.status(400).json("Unable to register");
    }
  }

  // CASE 2. User allready registered with google account
  if (data[0].hash === "google") {
    // update the user's last login time
    await dataBase("users")
      .update({
        last_loggedin: new Date(),
      })
      .where("userid", "=", data[0].userid);

    // Retrieve user data from the database
    const response = await getUserFromDB(data[0].userid, dataBase);
    return res.json(response);
  }

  // CASE 3. User registered with email and password
  if (data[0].hash !== "google") {
    return res.json(email);
  }
};
export default handleToken;
