import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSong } from "../service/song.api";

export const useSong = () => {
  const context = useContext(SongContext);
  const { songs, setSongs, song, setSong, mood, setMood, loading, setLoading } =
    context;

  const handleGetSong = async ({ mood: detectedMood }) => {
    setLoading(true);
    try {
      const data = await getSong({ mood: detectedMood });
      // Backend now returns an array in data.data
      const newSongs = Array.isArray(data?.data) ? data.data : [];
      setSongs(newSongs);
      setMood(detectedMood);
      // Optional: Auto-play the first song? No, user requested click to play.
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    songs, // array of song objects
    song, // currently playing song
    mood, // detected mood string
    loading,
    setSongs,
    setSong,
    setLoading,
    handleGetSong,
  };
};
