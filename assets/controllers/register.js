const handleRegister = async function (req, res, dataBase, bcrypt) {
  const { userName, email, password } = req.body;

  // INPUT VALIDATION
  if (!userName || !email || !password)
    return res.json("Missing required fields.");

  // Checking if email allready exists and returning response if so
  const existingEmail = await dataBase("login")
    .returning("*")
    .where("email", "=", email);
  if (existingEmail.length > 0) return res.json("Email allready registered.");

  // Checking if userName allready exists and returning response if so
  const existingUserName = await dataBase("users")
    .returning("*")
    .where("name", "=", userName);
  if (existingUserName.length > 0) return res.json("Username allready used.");

  // Hashing provided password
  const hash = bcrypt.hashSync(password, 10);

  dataBase.transaction(async (trx) => {
    try {
      // Inserting new user's password and email in login table and returning email
      const loginEmail = await trx("login").returning("email").insert({
        hash: hash,
        email: email,
      });

      // Inserting new user in users table and returning user
      const user = await trx("users").returning("*").insert({
        name: userName,
        email: loginEmail[0].email,
        joined: new Date(),
      });

      // responding with the newly registered user
      return res.json(user[0]);

      // catching error and sending it if user registration fails
    } catch (err) {
      console.error(err);
      return res.json("Unable to register");
    }
  });
};
export default handleRegister;
