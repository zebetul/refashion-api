const handleSignIn = async function (req, res, dataBase, bcrypt) {
  const { email, password } = req.body;

  // Retrieve login data for the provided email
  const signInData = await dataBase
    .select("*")
    .from("login")
    .where("email", "=", email)
    .first();

  if (!signInData) return res.json("email not registered");

  // Compare the provided password with the stored hash
  const passwordValid = await bcrypt.compare(password, signInData.hash);

  if (!passwordValid) return res.json("wrong password");

  // Retrieve the user based on the login information
  const user = await dataBase("users")
    .select("*")
    .where("userid", "=", signInData.userid);

  res.json(user[0]);
};
export default handleSignIn;
