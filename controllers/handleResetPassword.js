import { sendEmailTo } from "./helpers.js";

const handleResetPassword = async (req, res, db) => {
  const email = req.body.email;

  console.log(email);

  if (!email) {
    return res.json("Missing email");
  }

  const user = await db("users").select("*").where("email", "=", email).first();

  console.log(user);

  if (!user) {
    return res.json("Email not found");
  }

  // Send email with reset password link
  //   const response = await sendEmailTo(
  //     email,
  //     "Reset password",
  //     `Click here to reset your password: https://restil.ro/reset_password/${user.id}`
  //   );

  //   if (response.error) {
  //     return res.status(400).json({ error: response.error });
  //   }
};

export default handleResetPassword;
