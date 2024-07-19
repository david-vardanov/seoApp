const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const indexRouter = require("./routes/index");

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
