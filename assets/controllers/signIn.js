const handleSignIn = async function (req, res, dataBase, bcrypt) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(404).json("Missing required fields");

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

  const messagesSent = await dataBase("messages")
    .select("*")
    .where("sender_id", "=", signInData.userid);

  const messagesReceived = await dataBase("messages")
    .select("*")
    .where("receiver_id", "=", signInData.userid);

  const response = {
    ...user[0],
    messagesSent: messagesSent,
    messagesReceived: messagesReceived,
  };

  res.json(response);
};
export default handleSignIn;
