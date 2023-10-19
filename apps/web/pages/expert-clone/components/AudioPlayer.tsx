import { PlayIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioPlayer = ({ blobUrl }: { blobUrl: any }) => {
  const waveformRef = useRef(null);
  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#6D278E90",
      progressColor: "#6D278E",
      height: 50,
    });

    wavesurfer.load(blobUrl);

    // Play the audio
    const playButton = document.querySelector("#playButton");
    playButton &&
      playButton.addEventListener("click", () => {
        wavesurfer.playPause();
        wavesurfer.isPlaying();
      });

    return () => {
      // Clean up wave surfer instance
      wavesurfer.empty();
      wavesurfer.destroy();
    };
  }, [blobUrl]);

  return (
    <div className="relative">
      <div id="waveform" ref={waveformRef} />
      <button id="playButton" className="absolute -left-0 -top-8">
        <PlayIcon fill="#6D278E" className="text-pink hover:bg-pink/10  h-6 w-6 rounded-md p-1" />
      </button>
    </div>
  );
};

export default AudioPlayer;
