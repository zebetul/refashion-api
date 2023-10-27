import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import fileupload from "express-fileupload";
import cookieParser from "cookie-parser";

import { dataBase, PORT, ALLOWED_ORIGINS } from "./config.js";
import authorizeUser from "./middlewares/authorization.js";
import handleUserRegistration from "./controllers/handleUserRegistration.js";
import handleSignIn from "./controllers/handleSignIn.js";
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
import handleProfileImageUpload from "./controllers/users/handleProfileImageUpload.js";
import {
  handleAddToFavorites,
  handleDeleteFavorites,
  handleGetFavorites,
} from "./controllers/favorites.js";
import handleSignInWithGoogle from "./controllers/handleSignInWithGoogle.js";
import handleSession from "./controllers/handleSession.js";
import handleItemExchange from "./controllers/handleItemExchange.js";
import {
  handleUpdateStatus,
  handleDeleteOrder,
  handlePostOrder,
} from "./controllers/orders.js";
import handleContactUs from "./controllers/handleContactUs.js";
import handleSignOut from "./controllers/handleSignOut.js";
import handleVerifyEmail from "./controllers/handleVerifyEmail.js";
import handleResetPasswordRequest from "./controllers/handleResetPasswordRequest.js";
import handleUpdatePassword from "./controllers/handleUpdatePassword.js";

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials to be sent
};

app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(cors(corsOptions));

// PUBLIC ROUTES
app.get("/", (req, res) => {
  res.send("Server running!");
});
app.get("/googleClientId", (req, res) => {
  res.json({ googleClientId: process.env.GOOGLE_CLIENT_ID });
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
app.get("/verify-email/:session_id", (req, res) =>
  handleVerifyEmail(req, res, dataBase)
);

app.post("/signin", (req, res) => handleSignIn(req, res, dataBase, bcrypt));
app.post("/register", (req, res) =>
  handleUserRegistration(req, res, dataBase, bcrypt)
);
app.post("/google", (req, res) => handleSignInWithGoogle(req, res, dataBase));
app.post("/contact_us", (req, res) => handleContactUs(req, res, dataBase));
app.post("/reset_password", (req, res) =>
  handleResetPasswordRequest(req, res, dataBase)
);
app.post("/update_password/:token", (req, res) =>
  handleUpdatePassword(req, res, dataBase, bcrypt)
);

// PRIVATE ROUTES
app.get("/favorites/:id", authorizeUser, (req, res) =>
  handleGetFavorites(req, res, dataBase)
);

app.post("/users/profile/:id", authorizeUser, (req, res) =>
  handleProfileUpdate(req, res, dataBase)
);
app.post("/users/image", authorizeUser, (req, res) =>
  handleProfileImageUpload(req, res, dataBase)
);
app.post("/messages", authorizeUser, (req, res) =>
  handleMessage(req, res, dataBase)
);
app.post("/messages/mark_as_read", authorizeUser, (req, res) =>
  markMessagesAsRead(req, res, dataBase)
);
app.post("/wardrobe", authorizeUser, (req, res) =>
  handleNewItemUpload(req, res, dataBase)
);
app.post("/wardrobe/update_item/:id", (req, res) =>
  handleItemUpdate(req, res, dataBase)
);
app.post("/favorites", authorizeUser, (req, res) =>
  handleAddToFavorites(req, res, dataBase)
);
app.post("/exchange", authorizeUser, (req, res) =>
  handleItemExchange(req, res, dataBase)
);
app.post("/orders", authorizeUser, (req, res) =>
  handlePostOrder(req, res, dataBase)
);
app.post("/orders/update_status", authorizeUser, (req, res) =>
  handleUpdateStatus(req, res, dataBase)
);
app.post("/signout", authorizeUser, (req, res) =>
  handleSignOut(req, res, dataBase)
);

app.delete("/items", authorizeUser, (req, res) =>
  handleDeleteItem(req, res, dataBase)
);
app.delete("/favorites", authorizeUser, (req, res) =>
  handleDeleteFavorites(req, res, dataBase)
);
app.delete("/orders", authorizeUser, (req, res) =>
  handleDeleteOrder(req, res, dataBase)
);
app.delete("/users/profile/:id", authorizeUser, (req, res) =>
  handleDeleteProfile(req, res, dataBase)
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
