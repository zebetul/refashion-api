import express from "express";
import bcrypt from "bcrypt";
import items from "./assets/items.js";
import sellers from "./assets/sellers.js";

const app = express();

app.use(express.json());

// --> res = this is working
app.get("/", (req, res) => {
  res.send("I can hear you!");
});

// /signIn --> POST = succes/fail
app.post("/signin", (req, res) => {
  const user = sellers.find((user) => user.email === req.body.email);

  if (user) {
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        res.json("Password could not be verified");
        return;
      }

      result
        ? res.json("succes")
        : res.json("The email or the password do not correspond");
    });

    console.log(user.sellerName);
  }
});

// /register --> POST = user
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      res.json("fail, the password couldnt be hashed");
      return;
    }

    sellers.push({
      id: sellers.length,
      sellerName: name,
      email: email,
      password: hash,
      registeringDate: new Date(),
      image: "",
      rating: 0,
      city: "",
      birthYear: 0,
      preferedBrand: "",
      languages: "",
      aboutMe: "",
    });

    res.json("succes");

    console.log(sellers[sellers.length - 1]);
  });
});

// /allProducts --> GET = items
app.get("/products", (req, res) => {
  res.json(items);
});

app.listen(8000, () => {
  console.log("server ON");
});
