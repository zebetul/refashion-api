import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import knex from "knex";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";

import handleRegister from "./controllers/register.js";
import handleSignIn from "./controllers/signIn.js";
import {
  handleProfileUpdate,
  handleProfileGet,
} from "./controllers/users/profile.js";
import {
  handleGetItems,
  handleGetItemById,
  handleDeleteItem,
} from "./controllers/items.js";
import { handleMessage, markMessagesAsRead } from "./controllers/messages.js";
import {
  handleNewItemUpload,
  handleGetUserWardrobe,
} from "./controllers/wardrobe.js";
import handleProfileImageUpload from "./controllers/users/image.js";
import handleGetFilterOptions from "./controllers/filterOptions.js";
import {
  handleAddToFavorites,
  handleDeleteFavorites,
  handleGetFavorites,
} from "./controllers/favorites.js";
import handleToken from "./controllers/google.js";
import handleSession from "./controllers/handleSession.js";
import handleExchange from "./controllers/itemExchange.js";
import {
  handleUpdateStatus,
  handleDeleteOrder,
  handlePostOrder,
} from "./controllers/orders.js";

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
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server running!");
});
app.get("/items", (req, res) => handleGetItems(req, res, dataBase));
app.get("/item/:id", (req, res) => handleGetItemById(req, res, dataBase));
app.get("/filterOptions", (req, res) =>
  handleGetFilterOptions(req, res, dataBase)
);
app.get("/users/profile/:id", (req, res) =>
  handleProfileGet(req, res, dataBase)
);
app.get("/wardrobe/:id", (req, res) =>
  handleGetUserWardrobe(req, res, dataBase)
);
app.get("/favorites/:id", (req, res) => handleGetFavorites(req, res, dataBase));
app.get("/sessions", (req, res) => handleSession(req, res, dataBase));

app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, dataBase, bcrypt));
app.post("/google", (req, res) => handleToken(req, res, dataBase));
app.post("/users/profile/:id", (req, res) =>
  handleProfileUpdate(req, res, dataBase)
);
app.post("/users/image", (req, res) =>
  handleProfileImageUpload(req, res, dataBase)
);
app.post("/messages", (req, res) => handleMessage(req, res, dataBase));
app.post("/messages/mark_as_read", (req, res) =>
  markMessagesAsRead(req, res, dataBase)
);
app.post("/wardrobe", (req, res) => handleNewItemUpload(req, res, dataBase));
app.post("/favorites", (req, res) => handleAddToFavorites(req, res, dataBase));
app.post("/exchange", (req, res) => handleExchange(req, res, dataBase));
app.post("/orders", (req, res) => handlePostOrder(req, res, dataBase));
app.post("/orders/update_status", (req, res) =>
  handleUpdateStatus(req, res, dataBase)
);

app.delete("/items", (req, res) => handleDeleteItem(req, res, dataBase));
app.delete("/favorites", (req, res) =>
  handleDeleteFavorites(req, res, dataBase)
);
app.delete("/orders", (req, res) => handleDeleteOrder(req, res, dataBase));

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
