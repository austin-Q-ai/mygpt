import type { ChangeEvent, DragEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

import { Button, Label } from "@calcom/ui";
import { Edit2 } from "@calcom/ui/components/icon";

interface ImageUploaderProps {
  setImage: (image: string) => void;
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
}

function isImageFile(file?: File) {
  return file && file["type"].split("/")[0] === "image";
}

const ImageUploader: React.FC<ImageUploaderProps> = (props) => {
  const [image, setImage] = useState("");
  const [showSelection, setShowSelection] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef<Webcam | null>(null);

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && isImageFile(event.target.files[0])) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onCapture = (event: React.MouseEvent) => {
    event.preventDefault();
    if (webcamRef.current) {
      setImage(webcamRef.current.getScreenshot() as string);
      setShowWebcam(false);
      setShowSelection(false);
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files && isImageFile(event.dataTransfer.files[0])) {
      setImage(URL.createObjectURL(event.dataTransfer.files[0]));
    }
  };

  useEffect(() => {
    props.setImage(image);
  }, [image]);

  return (
    <div className="flex flex-col items-center p-10">
      <div
        onClick={() => setShowSelection(true)}
        className="show-edit relative h-[100px] w-[100px] cursor-pointer rounded-full bg-zinc-400 hover:opacity-80 sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px]">
        {image.length ? (
          <img
            className="h-[100px] w-[100px] rounded-full sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px]"
            src={image}
            alt="avatar"
          />
        ) : (
          <span className=" h-[100px] w-[100px] rounded-full sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px]">
            <p className="flex justify-center pt-4">Avatar</p>
          </span>
        )}
        <div className="edit-btn absolute top-0 flex h-full w-full items-center justify-center rounded-full bg-transparent">
          <Edit2 className="m-auto" />
        </div>
      </div>
      {showSelection && (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <Label className="m-4 rounded-md bg-gray-200 p-10 shadow-xl">
            <div
              onDrop={onDrop}
              onDragOver={handleDragOver}
              className="mt-5 flex h-60 w-60 cursor-pointer items-center justify-center border-2 border-dashed border-gray-400">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              <label htmlFor="file-upload " className=" text-slate-600">
                {image ? <img src={image} alt="Image" className="h-56 w-56" /> : "Drop image or click"}
              </label>
            </div>
            <Button
              onClick={() => setShowWebcam(true)}
              className="mt-5 border-[1px] border-gray-400 hover:border-gray-500">
              Capture Image
            </Button>
            <Button
              onClick={() => setShowSelection(false)}
              className="ml-9 mt-5 border-[1px] border-gray-400 text-red-500 hover:border-gray-500">
              Close
            </Button>
          </Label>
        </div>
      )}
      {showWebcam && (
        <div className="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-md bg-gray-200 p-10 shadow-xl">
            <Webcam
              audio={false}
              screenshotFormat="image/jpeg"
              ref={webcamRef}
              className="h-60 w-60 rounded-lg"
            />
            <br />
            <Button onClick={onCapture} className="mt-5 border-[1px] border-gray-400 hover:border-gray-500">
              Capture photo
            </Button>
            <Button
              onClick={() => setShowWebcam(false)}
              className="ml-9 mt-5 border-[1px] border-gray-400 text-red-500 hover:border-gray-500">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
