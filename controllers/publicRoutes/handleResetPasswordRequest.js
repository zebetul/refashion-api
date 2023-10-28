import { sendEmailTo } from "../../utils/helpers.js";
import crypto from "crypto";
import resetPasswordHTMLMarkup from "../../constants/htmlMarkups/resetPasswordHTMLMarkup.js";

const handleResetPasswordRequest = async (req, res, db) => {
  const email = req.body.email;

  // Check if email is provided
  if (!email) {
    return res.json("Missing email");
  }

  try {
    // Get user from database
    const user = await db("login")
      .select("*")
      .where("email", "=", email)
      .first();

    // If user doesn't exist, return error message
    if (!user) {
      return res.json("Email not found");
    }

    // Generate token and store it in database
    const token = await db("tokens")
      .insert({
        user_id: user.userid,
        token: crypto.randomBytes(16).toString("hex"),
      })
      .returning("token")
      .then((token) => token[0]);

    // Send email to user with reset password link containing token
    await sendEmailTo(
      email,
      "Reset password",
      resetPasswordHTMLMarkup(token.token)
    );

    // Return success message
    return res.json("Email sent");
  } catch (err) {
    console.log(err);

    // Return error message
    return res
      .status(500)
      .json(`🔥🔥🔥 Server error at reset_password: ${err.message}`);
  }
};

export default handleResetPasswordRequest;
