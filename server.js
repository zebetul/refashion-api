import express from "express";
import bcrypt from "bcrypt";
import items from "./assets/items.js";
import users from "./assets/users.js";
import cors from "cors";
import knex from "knex";

const app = express();

// CONNECTING TO DATABASE
const dataBase = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "zebetul",
    database: "refashion",
  },
});

app.use(express.json());
app.use(cors());

console.log("///////////////////");

// EXTRACTING ALL USERS
// dataBase
//   .select("*")
//   .from("users")
//   .then((data) => {
//     console.log(data);
//   });

app.get("/", (req, res) => {
  res.send("I can hear you!");
});

app.post("/signin", (req, res) => {
  const { email } = req.body.email;

  // OLD MOCKUP DATABASE
  // const user = users.find((user) => user.email === req.body.email);

  // if (user) {
  //   user.password === req.body.password
  //     ? res.json(user)
  //     : res.json("The email or the password do not correspond");
  // } else res.json("The email or the password do not correspond");
});

app.post("/register", async (req, res) => {
  const { userName, email, password } = req.body;

  // INPUT VALIDATION
  if (!userName || !email || !password)
    return res.json("Missing required fields");

  // checking if email allready exists and returning response if so
  const existingEmail = await dataBase("login")
    .returning("*")
    .where("email", "=", email);
  if (existingEmail.length > 0) return res.json("Email allready exists");

  // checking if userName allready exists and returning response if so
  const existingUserName = await dataBase("users")
    .returning("*")
    .where("name", "=", userName);
  if (existingUserName.length > 0) return res.json("Username allready exists");

  // hashing password
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
});

app.get("/products", (req, res) => {
  res.json(items);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(8000, () => {
  console.log("server ON");
});
