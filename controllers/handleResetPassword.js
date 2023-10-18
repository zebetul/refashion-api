import { sendEmailTo } from "./helpers.js";
import crypto from "crypto";
import resetPasswordHTMLMarkup from "./constants/htmlMarkups/resetPasswordHTMLMarkup.js";

const handleResetPassword = async (req, res, db) => {
  const email = req.body.email;

  if (!email) {
    return res.json("Missing email");
  }

  const user = await db("login").select("*").where("email", "=", email).first();

  if (!user) {
    return res.json("Email not found");
  }

  // Generate token
  const token = await db("tokens")
    .insert({
      user_id: user.userid,
      token: crypto.randomBytes(16).toString("hex"),
    })
    .returning("token")
    .then((token) => token[0]);

  // Send email with reset password link
  const response = await sendEmailTo(
    email,
    "Reset password",
    resetPasswordHTMLMarkup(token.token)
  );

  if (response.error) {
    return res.status(400).json({ error: response.error });
  }
};

export default handleResetPassword;
