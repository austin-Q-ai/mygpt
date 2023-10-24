import classNames from "classnames";
import { MicIcon, SquareIcon } from "lucide-react";
import MicRecorder from "mic-recorder-to-mp3";
import React, { useState, useEffect } from "react";

import { Button } from "@calcom/ui";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

interface VoiceUploaderProps {
  setVoice: (voiceURL: string) => void;
  setIsRecordingFlag: (isRecording: boolean) => void;
}

const VoiceUploader: React.FC<VoiceUploaderProps> = ({ setVoice, setIsRecordingFlag }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [blobURL, setBlobURL] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const startRecording = () => {
    setVoice("");
    if (isBlocked) {
      console.log("Permission Denied");
    } else {
      Mp3Recorder.start()
        .then(() => {
          setIsRecording(true);
          setIsRecordingFlag(true);
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
        setIsRecordingFlag(false);
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
    <>
      <Button
        variant="icon"
        size="lg"
        color="minimal"
        className={classNames(
          isRecording
            ? "border-gray-300  bg-gray-200  text-red-500 hover:bg-gray-300/90"
            : "text-secondary border-emphasis",
          "mx-2 h-[93%] border"
        )}
        onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? (
          <span className="relative flex h-6 w-6">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <SquareIcon fill="red" className="relative inline-flex animate-pulse" />
          </span>
        ) : (
          <MicIcon />
        )}
      </Button>
    </>
  );
};

export default VoiceUploader;
