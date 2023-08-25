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
  handleDeleteProfile,
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
  handleItemUpdate,
} from "./controllers/wardrobe.js";
import handleProfileImageUpload from "./controllers/users/image.js";
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
import handleContactUs from "./controllers/contactUs.js";
import handleSignOut from "./controllers/signOut.js";

const app = express();

// Connecting to database
const dataBase = knex({
  client: "pg",
  connection: {
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASSWORD,
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    database: "restil",
  },
});

const PORT = process.env.PORT || 8000;

const allowedOrigins = ["http://localhost:3000", "https://restil.onrender.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials to be sent
};

/**
 * Authenticate user based on sessionID cookie if it exists in the database
 * @param {Object} dataBase database object
 * @returns {Object} response object with error message if the user is not authenticated or next() if the user is authenticated
 * @author Cristi Sebeni
 **/
const authenticateUser = async function (req, res, next) {
  const { rfs_session_id } = req.cookies;

  if (!rfs_session_id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Check if the sessionID is in the database
  const session = await dataBase("sessions")
    .select("*")
    .where("session_id", "=", rfs_session_id)
    .first();

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(cors(corsOptions));

// PUBLIC ROUTES
app.get("/", (req, res) => {
  res.send("Server running!");
});
app.get("/items", (req, res) => handleGetItems(req, res, dataBase));
app.get("/item/:id", (req, res) => handleGetItemById(req, res, dataBase));

app.get("/users/profile/:id", (req, res) =>
  handleProfileGet(req, res, dataBase)
);
app.get("/wardrobe/:id", (req, res) =>
  handleGetUserWardrobe(req, res, dataBase)
);
app.get("/sessions", (req, res) => handleSession(req, res, dataBase));

app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, dataBase, bcrypt));
app.post("/google", (req, res) => handleToken(req, res, dataBase));
app.post("/contact_us", (req, res) => handleContactUs(req, res, dataBase));

// PRIVATE ROUTES
app.get("/favorites/:id", authenticateUser, (req, res) =>
  handleGetFavorites(req, res, dataBase)
);

app.post("/users/profile/:id", authenticateUser, (req, res) =>
  handleProfileUpdate(req, res, dataBase)
);
app.post("/users/image", authenticateUser, (req, res) =>
  handleProfileImageUpload(req, res, dataBase)
);
app.post("/messages", authenticateUser, (req, res) =>
  handleMessage(req, res, dataBase)
);
app.post("/messages/mark_as_read", authenticateUser, (req, res) =>
  markMessagesAsRead(req, res, dataBase)
);
app.post("/wardrobe", authenticateUser, (req, res) =>
  handleNewItemUpload(req, res, dataBase)
);
app.post("/wardrobe/update_item/:id", (req, res) =>
  handleItemUpdate(req, res, dataBase)
);
app.post("/favorites", authenticateUser, (req, res) =>
  handleAddToFavorites(req, res, dataBase)
);
app.post("/exchange", authenticateUser, (req, res) =>
  handleExchange(req, res, dataBase)
);
app.post("/orders", authenticateUser, (req, res) =>
  handlePostOrder(req, res, dataBase)
);
app.post("/orders/update_status", authenticateUser, (req, res) =>
  handleUpdateStatus(req, res, dataBase)
);
app.post("/signout", authenticateUser, (req, res) =>
  handleSignOut(req, res, dataBase)
);

app.delete("/items", authenticateUser, (req, res) =>
  handleDeleteItem(req, res, dataBase)
);
app.delete("/favorites", authenticateUser, (req, res) =>
  handleDeleteFavorites(req, res, dataBase)
);
app.delete("/orders", authenticateUser, (req, res) =>
  handleDeleteOrder(req, res, dataBase)
);
app.delete("/users/profile/:id", authenticateUser, (req, res) =>
  handleDeleteProfile(req, res, dataBase)
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
