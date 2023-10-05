import { ImageIcon } from "lucide-react";
import type { ChangeEvent, DragEvent } from "react";
import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

import { Button, Label } from "@calcom/ui";

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
  const innerImageRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    const handleClick = (e: any) => {
      if (e.target !== innerImageRef.current) {
        return;
      }
      fileInputRef.current?.click();
    };
    innerImageRef.current?.addEventListener("click", handleClick, true);
    return () => {
      innerImageRef.current?.removeEventListener("click", handleClick);
    };
  }, [showSelection]);

  useEffect(() => {
    props.setImage(image);
  }, [image]);

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={() => setShowSelection(true)}
        className="show-edit relative h-[100px] w-[100px] cursor-pointer rounded-md border-2 border-dashed border-gray-300 hover:opacity-80 sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[150px] lg:w-[250px]">
        {image.length ? (
          <img
            className="h-[100px] w-[100px] rounded-md object-contain p-2 sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[150px] lg:w-[250px]"
            src={image}
            alt="avatar"
          />
        ) : (
          <span className=" flex h-[100px] w-[100px] items-center justify-center rounded-md  sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[150px] lg:w-[250px]">
            <p className="">
              <ImageIcon width={70} height={70} color="#61677F" />
            </p>
          </span>
        )}
        {/* <div className="edit-btn absolute top-0 flex h-full w-full items-center justify-center rounded-full bg-transparent">
          <Edit2 className="m-auto" />
        </div> */}
      </div>
      {showSelection && (
        <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
          <Label className="m-4 rounded-md bg-gray-200 p-10 shadow-xl">
            <div
              onDrop={onDrop}
              onDragOver={handleDragOver}
              className="mt-5 flex h-60 w-60 cursor-pointer items-center justify-center border-2 border-dashed border-gray-400 ">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <label htmlFor="file-upload " className="cursor-pointer text-slate-600">
                <div ref={innerImageRef}>
                  {image ? (
                    <img src={image} alt="Image" className="h-56 w-56 object-contain" />
                  ) : (
                    "Drop image or click"
                  )}
                </div>
              </label>
            </div>
            <Button
              onClick={() => setShowWebcam(true)}
              className="mt-5 border-[1px] border-gray-400 hover:border-gray-500">
              Capture Image
            </Button>
            <Button
              onClick={() => setShowSelection(false)}
              className="ml-9 mt-5 border-[1px] border-gray-400  hover:border-gray-500">
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
              className="ml-9 mt-5 border-[1px] border-gray-400  hover:border-gray-500">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
