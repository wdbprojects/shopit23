/* CREATE TOKEN AND SAVE IT IN A COOKIE */
const saveTokenInCookie = (user, statusCode, res) => {
  /* CREATE JWT TOKEN */
  const token = user.getJWTToken();
  /* OPTIONS FOR COOKIE */
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  /* REPONSE */
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ token: token, user: user });
};

export default saveTokenInCookie;
