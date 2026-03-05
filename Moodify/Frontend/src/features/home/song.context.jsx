import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/khanradebojyoti/cohort-2-Moodify/songs/Jatt_Mehkma__RiskyjaTT.CoM__rmMCwKBI9.mp3",
    posterUrl:
      "https://ik.imagekit.io/khanradebojyoti/cohort-2-Moodify/posters/Jatt_Mehkma__RiskyjaTT.CoM__gigQbybip.jpeg",
    title: "Jatt Mehkma (RiskyjaTT.CoM)",
    mood: "happy",
  });

  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ song, setSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );
};
