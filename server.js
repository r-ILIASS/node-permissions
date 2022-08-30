require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents"); // logs request TODO: rename later
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const dbConnect = require("./config/dbConnect");
const PORT = process.env.PORT || 3500;

// CONNECT TO MONGODB
dbConnect();

app.use(logger); // custom middleware logger
app.use(credentials); // Handle options credentials check - before CORS! and fetch cookies credentials requirement
app.use(cors(corsOptions)); // Cross Origin Resource Sharing
app.use(express.urlencoded({ extended: false })); // handle urlencoded form data
app.use(express.json()); // built-in middleware for json
app.use(cookieParser()); // middleware for cookies

// SERVE STATIC FILES ON /
app.use("/", express.static(path.join(__dirname, "/public")));

// ROUTES
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// JWT PROTECTED ROUTES
app.use(verifyJWT); // will apply to all the next routes
app.use("/employees", require("./routes/api/employees"));

// NOT FOUND ROUTES
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`✓ Server Running On Port ${PORT}`));
});
