import { MicIcon } from "lucide-react";
import MicRecorder from "mic-recorder-to-mp3";
import React, { useState, useEffect } from "react";
import Countdown from "react-countdown";

import { Button } from "@calcom/ui";

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
    <div className="border-emphasis  my-6 flex flex-col items-center justify-center rounded-md border-2 border-dotted p-8 font-sans ">
      <div className="bg-emphasis mb-6  flex h-24 w-24 items-center rounded-full">
        <MicIcon className="text-secondary  mx-auto h-14 w-14" />
      </div>
      <h1 className="mb-8 text-center text-2xl font-medium">Voice Recorder</h1>
      <p className="text-subtle text-md mx-4 mb-2 break-words text-center md:mx-14 md:mb-8">{sampleText}</p>
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
        <h2 className="text-md mt-8 text-center font-medium">You have 30 seconds to record your audio</h2>
      )}
      <div className="flex items-center justify-center">
        <Button
          size="lg"
          color="secondary"
          className={`mt-8 w-full rounded-sm px-8 py-4 text-sm font-medium shadow-lg ${
            isRecording ? "bg-red-500 text-white hover:text-red-500" : ""
          }`}
          onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
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
