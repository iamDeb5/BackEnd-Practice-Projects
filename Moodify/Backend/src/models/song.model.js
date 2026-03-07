const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    default: "",
  },
  mood: {
    type: String,
    enum: {
      values: [
        "sad",
        "happy",
        "surprised",
        "angry",
        "fearful",
        "disgusted",
        "neutral",
      ],
      message: "Invalid mood: {VALUE}",
    },
  },
});

const songModel = mongoose.model("Songs", songSchema);

module.exports = songModel;
