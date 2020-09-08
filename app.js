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
    let tweetsWithURL = 0;
    let userWithMostURL = [];
    let domainCount = [];
    data.map((data) => {
      if (data.entities.urls.length > 0) {
        tweetsWithURL += 1;

        const dId = domainCount.findIndex(
          (d) => d.domain === data.entities.urls[0].display_url.split("/")[0]
        );

        if (dId === -1) {
          domainCount.push({
            domain: data.entities.urls[0].display_url.split("/")[0],
            count: 0,
          });
        } else {
          domainCount[dId].count += 1;
        }

        const uId = userWithMostURL.findIndex((u) => u.name === data.user.name);
        // console.log(uId);
        if (uId === -1) {
          userWithMostURL.push({ name: data.user.name, count: 0 });
        } else {
          userWithMostURL[uId].count += 1;
        }
      }
    });
    // res.send(tweetsWithURL);
    res.send({
      tweetHasLink: tweetsWithURL,
      userWithMostURL: userWithMostURL,
      domainWithURL: domainCount,
    });
  });
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
