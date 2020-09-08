const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");

const twitterRoutes = require("./routes/twitterAuth");

const mongoDBURL = process.env.mongoURL;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(twitterRoutes);

mongoose
  .connect(mongoDBURL, { useNewUrlParser: true })
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log("listening at port 8080");
    });
  })
  .catch((err) => {
    console.log(err);
  });
