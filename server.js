const express = require("express");
const path = require("path");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv/config");
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Set Port 
const PORT = process.env.PORT || 5000;

//Express server
const app = express();

//Routes Requires
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


mongoose.set('useCreateIndex', true);

// Connect Database
mongoose.connect(
  process.env.DEV_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to mongoDB");
  }
);

// JWT
app.use('/api/user', passport.authenticate('jwt', {session: false}), require('./routes/user'));
// app.use('/api/post', passport.authenticate('jwt', {session: false}), require('./routes/post'));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Unresgister routes -- 404 page not found
app.get("/api/*", (req, res) => {
  res.status(404).json({message: "Page not found"});
});

console.log(PORT)

// Server listen on PORT
app.listen(PORT, () => console.log("express running"));
