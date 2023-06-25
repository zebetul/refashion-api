const handleSignIn = async function (req, res, dataBase, bcrypt) {
  try {
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

    // query for favorites, the result will be an array of itemid's

    const favList = await dataBase("favorites")
      .select("itemid")
      .where("userid", "=", signInData.userid);

    const favorites = favList.map((item) => item.itemid);

    const response = {
      ...user[0],
      messagesSent: messagesSent,
      messagesReceived: messagesReceived,
      favorites,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(400).json("error signing in");
  }
};
export default handleSignIn;
