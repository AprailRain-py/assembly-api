const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  tweets: {
    type: [
      {
        tweets: {
          type: String,
          required: true,
        },
        whoTweeted: {
          type: String,
          required: true,
        },
        hashTags: {
          type: [
            {
              type: String,
              required: false,
            },
          ],
        },
        urls: [
          {
            type: String,
            required: false,
          },
        ],
      },
    ],
  },
});

module.exports = mongoose.model("User", userSchema);
