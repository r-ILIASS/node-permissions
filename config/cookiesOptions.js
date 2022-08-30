/** Make sure to add the maxAge option when needed
 * @example { ...cookiesOptions, maxAge: 24 * 60 * 60 * 1000 }
 */
const cookiesOptions = {
  httpOnly: true,
  sameSite: "None",
  // TODO: uncomment for production
  // secure: true
};

module.exports = cookiesOptions;
