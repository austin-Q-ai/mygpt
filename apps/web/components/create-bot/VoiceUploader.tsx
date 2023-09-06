import MicRecorder from "mic-recorder-to-mp3";
import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });
const VoiceUploader = (props) => {
  const [isRecording, setIsRecording] = useState(false);
  const [blobURL, setBlobURL] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const onData = () => {};

  const onStop = (blob) => {
    setAudioDetails({ blobURL: URL.createObjectURL(blob.blob) });
  };

  const startRecording = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e) => console.error(e));
    }
  };

  const stopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        props.setVoice(blobURL);
        setIsRecording(false);
      })
      .catch((e) => console.log(e));
  };

  const onSave = (blob) => {
    console.log("onSave", blob);
  };

  const onSaveFailure = (error) => {
    console.error("onSaveFailure", error);
  };
  useEffect(() => {
    navigator.getUserMedia(
      { audio: true },
      () => {
        console.log("Permission Granted");
        setIsBlocked(false);
      },
      () => {
        console.log("Permission Denied");
        setIsBlocked(true);
      }
    );
  }, []);
  const sampleText =
    "In today's fast-paced world, technology has become an integral part of our lives. From smartphones to social media platforms, we are constantly connected and reliant on digital tools. The IT industry plays a pivotal role in shaping this digital landscape, driving innovation and enabling seamless communication. From software development to network infrastructure, IT professionals tackle complex challenges to keep businesses running efficiently. With a focus on cybersecurity and data management, their expertise ensures the integrity and safety of valuable information. In an increasingly interconnected world, the field of IT continues to evolve and shape the way we live and work.";

  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] p-8">
      <h1 className="mb-8 text-center text-3xl font-semibold">Voice Recorder</h1>
      <p className="mb-8 text-justify text-lg">{sampleText}</p>
      {isRecording ? (
        <Countdown
          date={Date.now() + 30000}
          renderer={({ seconds, minutes }) => (
            <h2 className="mt-8 text-center text-lg font-semibold">
              Time remaining: {minutes}:{seconds}
            </h2>
          )}
          onComplete={stopRecording}
        />
      ) : (
        <h2 className="text-md mt-8 text-center font-semibold">You have 30 seconds to record your audio</h2>
      )}
      <div className="flex items-center justify-center">
        <button
          className={`mt-8 w-full rounded-sm px-8 py-4 text-lg font-semibold shadow-lg ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          }`}
          onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      {blobURL && (
        <div className="mt-8 text-center">
          <h2 className="mb-4 text-lg font-semibold">Your Recording:</h2>
          <audio controls src={blobURL} />
        </div>
      )}
    </div>
  );
};

export default VoiceUploader;
