import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import items from "./assets/items.js";
import users from "./assets/users.js";
import handleRegister from "./assets/controllers/register.js";
import handleSignIn from "./assets/controllers/signIn.js";

const app = express();

// connecting to database
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

app.get("/", (req, res) => {
  res.send("I can hear you!");
});

app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));

app.post("/register", (req, res) => handleRegister(req, res, dataBase, bcrypt));

app.get("/products", (req, res) => {
  res.json(items);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(8000, () => {
  console.log("server ON");
});
