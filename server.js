const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv/config");
const passport = require('passport');//after you session 
const jwt = require('jsonwebtoken');
// const mongooseConnect = require('./helper/mongodb')


//Routes includes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.set('useCreateIndex', true);

const PORT = process.env.PORT || 5000;

app.use(cors());

mongoose.connect(
  process.env.DEV_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongoDB");
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

//passport ininitalied after you session is a must
app.use(passport.initialize());
app.use(passport.session());

app.get("/api/*", (req, res) => {
  res.status(404).json({message: "Page not found"});
});

console.log(PORT)
app.listen(PORT, () => console.log("express running"));
