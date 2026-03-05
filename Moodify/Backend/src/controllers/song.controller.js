const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

const uploadSong = async (req, res) => {
  const songBuffer = req.file.buffer;
  const { mood } = req.body;

  const tags = id3.read(songBuffer);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      fileName: tags.title + ".mp3",
      folder: "/cohort-2-Moodify/songs",
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      fileName: tags.title + ".jpeg",
      folder: "/cohort-2-Moodify/posters",
    }),
  ]);

  const song = await songModel.create({
    url: songFile.url,
    posterUrl: posterFile.url,
    title: tags.title,
    mood,
  });

  return res.status(201).json({
    success: true,
    message: "Song uploaded successfully",
    data: song,
  });
};

const getSong = async (req, res) => {
  const { mood } = req.query;

  const song = await songModel.findOne({ mood });

  return res.status(200).json({
    success: true,
    message: "Song fetched successfully",
    data: song,
  });
};

module.exports = { uploadSong, getSong };
