const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

const { readdirSync } = require("fs");

const app = express();
app.use(express.json());
app.use(cors());
// const userRoutes = require("./routes/user");
// app.use("/user", userRoutes);

//*******routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

//******database

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Mongoose"))
  .catch(() => console.log("Connection error with Mongoose"));

app.listen(PORT, function () {
  console.log(`Server is listening on port ${PORT}`);
});
