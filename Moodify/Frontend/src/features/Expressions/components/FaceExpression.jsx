import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";
import "./FaceExpression.scss";

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Camera starts automatically — always shows live feed
  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });
    return () => {
      landmarkerRef.current?.close();
      videoRef.current?.srcObject?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function handleDetect() {
    if (isDetecting) return;
    setIsDetecting(true);
    setExpression(null);

    // Short pause so the camera frame is fresh
    await new Promise((r) => setTimeout(r, 400));

    const expr = detect({ landmarkerRef, videoRef, setExpression });
    if (expr) onClick(expr);

    setIsDetecting(false);
  }

  return (
    <div className="face-expression">
      {/* Circular live camera feed */}
      <div
        className={`face-expression__circle ${isDetecting ? "face-expression__circle--analyzing" : ""}`}
      >
        <video
          ref={videoRef}
          className="face-expression__video"
          playsInline
          muted
        />
        <div className="face-expression__ring" />
      </div>

      {/* Footer */}
      <div className="face-expression__footer">
        {/* Dots — only pulse while detecting */}
        <div className="face-expression__dots">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`face-expression__dot ${isDetecting ? "face-expression__dot--active" : ""}`}
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>

        {/* Result label */}
        {expression && (
          <span className="face-expression__result">
            Detected: <strong>{expression}</strong>
          </span>
        )}

        {/* The single "Detect Mood" button */}
        <button
          className={`face-expression__btn ${isDetecting ? "face-expression__btn--detecting" : ""}`}
          onClick={handleDetect}
          disabled={isDetecting}
        >
          {isDetecting ? "Analyzing..." : "Detect Mood"}
        </button>
      </div>
    </div>
  );
}
