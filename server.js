import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import fileupload from "express-fileupload";

import handleRegister from "./assets/controllers/register.js";
import handleSignIn from "./assets/controllers/signIn.js";
import {
  handleProfileUpdate,
  handleProfileGet,
} from "./assets/controllers/profile.js";
import handleGetAllItems from "./assets/controllers/items.js";
import handleMessage from "./assets/controllers/messages.js";
import handleNewItem from "./assets/controllers/wardrobe.js";

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
app.use(fileupload());
app.use(cors());

app.get("/", (req, res) => res.send("I can hear you!"));
app.get("/items", (req, res) => handleGetAllItems(req, res, dataBase));
app.get("/users/profile/:id", (req, res) =>
  handleProfileGet(req, res, dataBase)
);

app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, dataBase, bcrypt));
app.post("/users/profile/:id", (req, res) =>
  handleProfileUpdate(req, res, dataBase)
);
app.post("/messages", (req, res) => handleMessage(req, res, dataBase));
app.post("/wardrobe", (req, res) => handleNewItem(req, res, dataBase));

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
