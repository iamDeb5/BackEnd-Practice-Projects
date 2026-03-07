const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

const uploadSong = async (req, res) => {
  try {
    const songBuffer = req.file.buffer;
    const { mood, artist } = req.body;

    const tags = id3.read(songBuffer);

    const uploads = [
      storageService.uploadFile({
        buffer: songBuffer,
        fileName: (tags.title || req.file.originalname) + ".mp3",
        folder: "/cohort-2-Moodify/songs",
      }),
    ];

    // Only upload poster if the MP3 has embedded artwork
    if (tags.image?.imageBuffer) {
      uploads.push(
        storageService.uploadFile({
          buffer: tags.image.imageBuffer,
          fileName: (tags.title || req.file.originalname) + ".jpeg",
          folder: "/cohort-2-Moodify/posters",
        }),
      );
    }

    const results = await Promise.all(uploads);
    const songFile = results[0];
    const posterFile = results[1] || null;

    const song = await songModel.create({
      url: songFile.url,
      posterUrl: posterFile ? posterFile.url : "",
      title: tags.title || req.file.originalname,
      artist: artist || tags.artist || "",
      mood,
    });

    return res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      data: song,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getSong = async (req, res) => {
  try {
    const { mood } = req.query;

    if (!mood) {
      return res
        .status(400)
        .json({ success: false, message: "mood query param is required" });
    }

    // Return ALL songs for the mood, shuffled randomly
    const songs = await songModel.aggregate([
      { $match: { mood } },
      { $sample: { size: 50 } }, // random order, up to 50
    ]);

    return res.status(200).json({
      success: true,
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (err) {
    console.error("getSong error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { uploadSong, getSong };
