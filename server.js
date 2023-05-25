import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import users from "./assets/users.js";
import handleRegister from "./assets/controllers/register.js";
import handleSignIn from "./assets/controllers/signIn.js";
import {
  handleProfileUpdate,
  handleGetSeller,
} from "./assets/controllers/profile.js";
import handleItemsFetch from "./assets/controllers/items.js";

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

app.get("/", (req, res) => res.send("I can hear you!"));
app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, dataBase, bcrypt));
app.post("/users/profile/:id", (req, res) =>
  handleProfileUpdate(req, res, dataBase)
);
app.get("/users/profile/:id", (req, res) =>
  handleGetSeller(req, res, dataBase)
);

app.get("/items", (req, res) => handleItemsFetch(req, res, dataBase));

app.get("/users", (req, res) => {
  res.json(users);
});

app.listen(8000, () => {
  console.log("server ON");
});
