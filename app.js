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

app.get("/", async (req, res, next) => {
  const Twit = require("Twit");
  var T = new Twit({
    consumer_key: process.env.apikey,
    consumer_secret: process.env.apisecret,
    access_token: "1215320788338761729-YEKOfVaa2LWvkgrW6z4hxxWiACvn5L",
    access_token_secret: "8FRDHF1cveSknQLzbiggQNuzRz5h55mqrlgTWSVVM2Ijc",
  });
  var options = {
    tweet_mode: "extended",
    result_type: "recent",
    unitl: "20200907",
    count: 200,
  };
  //   , count: 20
  T.get("statuses/home_timeline", options, function (err, data) {
    res.send(data);
  });
  // const User = require("./models/user");
  // const tweetHasLink = await User.find({
  //   "tweets.hasURL": true,
  // }).estimatedDocumentCount();
  // const userWithMostLinkShared = await User.find({
  //   "tweets.hasURL": true,
  // }).select({ "tweets.whoTweeted": 1, _id: 0 });
  // const tweetWithDomain = await User.find({
  //   "tweets.hasURL": true,
  // }).select({ "tweets.urls": 1, _id: 0 });
});

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
