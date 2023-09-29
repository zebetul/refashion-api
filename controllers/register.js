import { getUserFromDB, newSession, sendEmailTo } from "./helpers.js";
import verifyEmailHtmlMarkup from "./constants/verifyEmailHtmlMarkup.js";

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

  // New Transaction for inserting new user in database
  const trx = await dataBase.transaction();

  try {
    // Inserting new user's password and email in login table
    const newUser = await trx("login").returning("*").insert({
      hash: hash,
      email: email,
    });

    // Inserting new user in users table and returning user
    const data = await trx("users").returning("*").insert({
      userid: newUser[0].userid,
      name: userName,
      email: email,
      joined: new Date(),
    });

    await trx.commit();

    // Retreiving the new user from the database
    const response = await getUserFromDB(data[0].userid, dataBase);

    // Creating a new session for the user
    const session = await newSession(data[0].userid, dataBase);

    const { session_id, expires_at } = session;

    // Setting the session cookie
    res.cookie("rfs_session_id", session_id, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: expires_at,
      path: "/",
    });

    sendEmailTo(
      "contact@restil.ro",
      `Verificare email: ${email}, nume: ${userName}`,
      verifyEmailHtmlMarkup
    );

    return res.json(response);
  } catch (err) {
    await trx.rollback();
    console.log(err);
    return res.status(400).json("Unable to register");
  }
};
export default handleRegister;
