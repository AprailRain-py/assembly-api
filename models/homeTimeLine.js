const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    tweets: {
      type: "string",
      required: true,
    },
    whoTweeted: {
      type: "string",
      required: true,
    },
    hashTags: {
      type: [
        {
          type: "string",
          required: false,
        },
      ],
    },
    urls: [
      {
        type: "string",
        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TweetData", tweetSchema);
