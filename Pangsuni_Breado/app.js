const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const nunjucksDate = require("nunjucks-date-filter");
const dotenv = require("dotenv");
const passport = require("passport");
dotenv.config();

const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const commentRouter = require("./routes/comment");
const boardRouter = require("./routes/board");
const storeRouter = require("./routes/store");
const adminRouter = require("./routes/admin");
const adminStoreRouter = require("./routes/admin/adminStore");
const adminOrderRouter = require("./routes/admin/adminOrder");
const adminProductRouter = require("./routes/admin/adminProduct");
const adminBoardRouter = require("./routes/admin/adminBoard");
const passportConfig = require("./passport");
passportConfig(); // 패스포트 설정

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
let env = nunjucks.configure("views", {express: app, watch: true,});
nunjucksDate.setDefaultFormat("YYYY-MM-DD");
env.addFilter("date", nunjucksDate); // 넌적스 템플릿 엔진에 date format을 위해 적용

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/comment", commentRouter);
app.use("/board", boardRouter);
app.use("/store", storeRouter);
app.use("/admin", adminRouter);
app.use("/admin/store", adminStoreRouter);
app.use("/admin/order", adminOrderRouter);
app.use("/admin/product", adminProductRouter);
app.use("/admin/board", adminBoardRouter);
app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  res.locals.user = null;
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
