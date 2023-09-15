import MicRecorder from "mic-recorder-to-mp3";
import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

interface VoiceUploaderProps {
  setVoice: (voiceURL: string) => void;
}

const VoiceUploader: React.FC<VoiceUploaderProps> = ({ setVoice }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [blobURL, setBlobURL] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const sampleText = `
    Hi, you’ve reached [your name]. Thanks for calling. I can’t answer your call at the moment, however if you leave your 
    name, number and message, I’ll get back to you as soon I can.

    There’s nothing wrong with this classic style of voicemail greeting. It’s short, sharp, and to the point. While it might 
    seem rushed, it states all necessary information the caller needs to include and avoids any irrelevant details the caller 
    doesn’t need at that point in time.
  `;

  const startRecording = () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
        })
        .catch((e: any) => console.error(e));
    }
  };

  const stopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(([, blob]: [unknown, Blob]) => {
        const blobURL = URL.createObjectURL(blob);
        setBlobURL(blobURL);
        setVoice(blobURL);
        setIsRecording(false);
      })
      .catch((e: any) => console.log(e));
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        console.log("Permission Granted");
        setIsBlocked(false);
      })
      .catch(() => {
        console.log("Permission Denied");
        setIsBlocked(true);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center rounded-[10px] border-2 border-dashed border-white p-8">
      <h1 className="mb-8 text-center text-2xl font-semibold">Voice Recorder</h1>
      <p className="mb-8 text-justify text-sm">{sampleText}</p>
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
          className={`mt-8 w-full rounded-sm px-8 py-4 text-sm font-semibold shadow-lg ${
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
