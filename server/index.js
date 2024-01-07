const express = require("express");
const app = express();
var path = require("path");
const cookieparser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const CustomErrorGenerateHandler = require("./utilities/CustomErrorGenerateHandler");
const { errorHandler } = require("./middlewares/errorHandler");
const { databaseConnection } = require("./configuration/database");
const { cloudinaryConnection } = require("./configuration/cloudinary");

const authenticationRoutes = require("./routes/authentication");

const PORT = process.env.PORT || 4000;
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

databaseConnection();
cloudinaryConnection();

app.use("/favicon.ico", (req, res) => res.status(204));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: "Set-Cookie",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      touchAfter: 24 * 60 * 60,
    }),
    cookie: {
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/api/v1/authentication", authenticationRoutes);

app.all("*", (req, res, next) => {
  next(
    new CustomErrorGenerateHandler(
      `Something went wrong at ${req.url}, requested page not found 🥲.....`,
      404
    )
  );
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
