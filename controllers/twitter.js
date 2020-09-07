const Twit = require("twit");
const oauth = require("oauth");
const User = require("../models/user");

const consumer = new oauth.OAuth(
  "https://twitter.com/oauth/request_token",
  "https://twitter.com/oauth/access_token",
  process.env.apikey,
  process.env.apisecret,
  "1.0A",
  "https://practical-hoover-59ac07.netlify.app/auth/twitter/callback",
  "HMAC-SHA1"
);

exports.startAuth = (req, res, next) => {
  consumer.getOAuthRequestToken(function (
    error,
    oauthRequestToken,
    oauthRequestTokenSecret,
    results
  ) {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send({ error: "Error getting OAuth request token : " + error });
    } else {
      console.log("oauthRequestToken " + oauthRequestToken);
      console.log("oauthRequestTokenSecret " + oauthRequestTokenSecret);
      res.status(200).send({
        redirectUrl:
          "https://twitter.com/oauth/authorize?oauth_token=" +
          oauthRequestToken,
        oauthRequestToken: oauthRequestToken,
        oauthRequestTokenSecret: oauthRequestTokenSecret,
      });
    }
  });
};

exports.callBack = (req, res, next) => {
  console.log("oauthRequestToken " + req.params.oauthRequestToken);
  console.log("oauthRequestTokenSecret " + req.params.oauthRequestTokenSecret);
  console.log("oauth_verifier " + req.params.oauth_verifier);

  consumer.getOAuthAccessToken(
    req.params.oauthRequestToken,
    req.params.oauthRequestTokenSecret,
    req.params.oauth_verifier,
    function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.status(500).send({
          error:
            "Error getting OAuth access token : " +
            error +
            "[" +
            oauthAccessToken +
            "]" +
            "[" +
            oauthAccessTokenSecret +
            "]" +
            "[" +
            results +
            "]",
        });
      } else {
        res.status(200).send({
          oauthAccessToken: oauthAccessToken,
          oauthAccessTokenSecret: oauthAccessTokenSecret,
        });
      }
    }
  );
};

exports.verifyAndTimeLine = async (req, res, next) => {
  const oAuthT = req.params.oauthAccessToken;
  const oAuthSc = req.params.oauthAccessTokenSecret;
  consumer.get(
    "https://api.twitter.com/1.1/account/verify_credentials.json",
    oAuthT,
    oAuthSc,
    function (error, data, response) {
      if (error) {
        console.log(error);
        res.status(500).send({ error: "authentication error" });
      } else {
        const parsedData = JSON.parse(data);

        // get home timeline

        var T = new Twit({
          consumer_key: process.env.apikey,
          consumer_secret: process.env.apisecret,
          access_token: oAuthT,
          access_token_secret: oAuthSc,
        });
        var options = {
          tweet_mode: "extended",
          result_type: "recent",
          unitl: "20200907",
        };
        //   , count: 20
        T.get("statuses/home_timeline", options, function (err, data) {
          const timeLineData = data.map((data) => {
            const tweets = {
              tweets: data.full_text,
              whoTweeted: data.user.name,
              hashTags:
                data.entities.hashtags.length > 0
                  ? data.entities.hashtags.map((h) => h.text)
                  : "",
              urls:
                data.entities.urls.length > 0
                  ? data.entities.urls.map((u) => u.url)
                  : "",
            };
            return tweets;
          });

          const user = new User({
            userName: parsedData.name,
            tweets: timeLineData,
          });
          user
            .save()
            .then((userData) => {
              res.send({ homeTimeLine: userData, user: parsedData });
              // console.log(data);
              console.log("Successfull");
            })
            .catch((err) => console.log(err));
        });
      }
    }
  );
};
