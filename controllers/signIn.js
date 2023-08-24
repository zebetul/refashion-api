import { getUserFromDB, newSession } from "./helpers.js";

const handleSignIn = async function (req, res, dataBase, bcrypt) {
  try {
    const { email, password } = req.body;

    // Data validation
    if (!email || !password)
      return res.status(404).json("Missing required fields");

    // Try to get  the user's signin data from database
    const signInData = await dataBase
      .select("*")
      .from("login")
      .where("email", "=", email)
      .first();

    // Check if the user exists. If doesn't, return error
    if (!signInData) return res.json("email not registered");

    // Compare the provided password with the stored hash
    const passwordValid = await bcrypt.compare(password, signInData.hash);

    // If the password is wrong, return error
    if (!passwordValid) return res.json("wrong password");

    // update the user's last login time
    await dataBase("users")
      .update({
        last_loggedin: new Date(),
      })
      .where("userid", "=", signInData.userid);

    // Get the user from database
    const user = await getUserFromDB(signInData.userid, dataBase);

    // Create a session for the user
    const session = await newSession(signInData.userid, dataBase);
    const { session_id, expires_at } = session;

    // Set the session cookie
    res.cookie("rfs_session_id", session_id, {
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
      expires: expires_at,
      path: "/", // cookie will be sent to all routes
    });

    return res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json("error signing in");
  }
};
export default handleSignIn;
