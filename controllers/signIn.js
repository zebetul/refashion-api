import { getUserFromDB } from "./helpers.js";

const handleSignIn = async function (req, res, dataBase, bcrypt) {
  try {
    const { email, password } = req.body;

    // Data validation
    if (!email || !password)
      return res.status(404).json("Missing required fields");

    const signInData = await dataBase
      .select("*")
      .from("login")
      .where("email", "=", email)
      .first();
    if (!signInData) return res.json("email not registered");

    // Compare the provided password with the stored hash
    const passwordValid = await bcrypt.compare(password, signInData.hash);

    if (!passwordValid) return res.json("wrong password");

    // Retrieve login data for the provided email
    const response = await getUserFromDB(signInData.userid, dataBase);

    return res.json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json("error signing in");
  }
};
export default handleSignIn;
