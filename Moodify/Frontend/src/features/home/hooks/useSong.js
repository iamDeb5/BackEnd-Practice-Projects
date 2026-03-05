import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSong } from "../service/song.api";

export const useSong = () => {
  const context = useContext(SongContext);

  const { song, setSong, loading, setLoading } = context;

  const handleGetSong = async ({ mood }) => {
    setLoading(true);
    const data = await getSong({ mood });
    setSong(data.data);
    setLoading(false);
  };

  return {
    song,
    setSong,
    loading,
    setLoading,
    handleGetSong,
  };
};
