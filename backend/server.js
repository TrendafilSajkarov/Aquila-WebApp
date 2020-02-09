const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const errorHendler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

// Route files
const languages = require("./routes/languages");
const categories = require("./routes/categories");

// Body parser
const app = express();

// --------------------------------
// ------------- 6.4 --------------
//    --   Select & Sorting   --
// --------------------------------
// --------------------------------

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/languages", languages);
// app.use("/api/v1/categories", categories);

app.use(errorHendler);

const PORT = process.env.PORT || 3000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);

// Hendle unhendled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(
    `Error name: ${err.name}, Error message: ${err.message}, Error reason: ${err.reason}`
  );
  server.close(() => process.exit(1));
});
