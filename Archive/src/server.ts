import bodyParser from "body-parser";
import express from "express";

import cors from "cors";

import connectDB from "../config/database";
import auth from "./routes/api/auth";
import product from "./routes/api/product";

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/product", product);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
