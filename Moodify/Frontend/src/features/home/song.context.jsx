import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  // songs: array of song objects from backend
  // song: currently playing song object
  // mood: string — the last detected mood
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState(null);
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider
      value={{
        songs,
        setSongs,
        song,
        setSong,
        mood,
        setMood,
        loading,
        setLoading,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
