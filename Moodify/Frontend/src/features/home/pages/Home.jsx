import React from "react";
import FaceExpression from "../../Expressions/components/FaceExpression";
import Player from "../components/Player";
import MoodCard from "../components/MoodCard";
import Navbar from "../components/Navbar";
import { useSong } from "../hooks/useSong";
import "../styles/Home.scss";

const Home = () => {
  const { handleGetSong } = useSong();

  return (
    <div className="home-page">
      {/* Gradient mesh background blobs */}
      <div className="home-page__blob home-page__blob--teal" />
      <div className="home-page__blob home-page__blob--peach" />
      <div className="home-page__blob home-page__blob--white" />

      <Navbar />

      <main className="home-content">
        <div className="home-content__inner">
          {/* Left: Circular webcam */}
          <FaceExpression
            onClick={(expression) => {
              handleGetSong({ mood: expression });
            }}
          />

          {/* Right: Mood card */}
          <MoodCard onListenMore={() => handleGetSong({ mood: "happy" })} />
        </div>
      </main>

      <Player />
    </div>
  );
};

export default Home;
