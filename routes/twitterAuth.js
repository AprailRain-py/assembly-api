const express = require("express");
const router = express.Router();
const authController = require("../controllers/twitter");

router.get("/start-auth", authController.startAuth);

router.get(
  "/callback/:oauthRequestToken/:oauthRequestTokenSecret/:oauth_verifier",
  authController.callBack
);

router.get(
  "/verify/:oauthAccessToken/:oauthAccessTokenSecret",
  authController.verifyAndTimeLine
);

module.exports = router;
