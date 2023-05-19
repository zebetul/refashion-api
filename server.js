import express from "express";
import bcrypt from "bcrypt";
import items from "./assets/items.js";
import users from "./assets/users.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("I can hear you!");
});

app.post("/signin", (req, res) => {
  const user = users.find((user) => user.email === req.body.email);

  if (user) {
    user.password === req.body.password
      ? res.json(user)
      : res.json("The email or the password do not correspond");
  } else res.json("The email or the password do not correspond");
});

app.post("/register", (req, res) => {
  const { userName, email, password } = req.body;

  users.push({
    id: users.length,
    userName: userName,
    email: email,
    password: password,
    registeringDate: new Date(),
    image: "",
    rating: 0,
    city: "",
    birthYear: 0,
    preferedBrand: "",
    languages: "",
    aboutMe: "",
  });

  res.json(users[users.length - 1]);
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
