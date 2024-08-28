import express from "express";
import dotenv from "dotenv";
import logTheEvent from "./middlewares/loger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./routes/userRoute.js";
dotenv.config();
const port = process.env.port;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
// to log out every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  logTheEvent(`${req.method} ${req.headers.origin} ${req.url}`);
  next();
});
app.use("^/$", (req, res) => res.statusCode(404));
app.use("/users", user);
app.all("/*", (req, res) => res.sendStatus(404));
// incase if there is an error
app.use((err, req, res, next) => {
  logTheEvent(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
  );
  next();
});
app.listen(port, () => console.log(`http://localhost:${port}`));
