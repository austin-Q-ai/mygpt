import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import {Button} from "@calcom/ui"
import { Edit2 } from "@calcom/ui/components/icon";

function handleDragOver(e) {
    e.preventDefault();
}

function isImageFile(file) {
    return file && file['type'].split('/')[0] === 'image';
}

function ImageUploader() {
    const [image, setImage] = useState("");
    const [showSelection, setShowSelection] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const webcamRef = useRef(null);

    const onImageUpload = (event) => {
        if (isImageFile(event.target.files[0])) {
            setImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const onCapture = (event) => {
        event.preventDefault();
        setImage(webcamRef.current.getScreenshot());
        setShowWebcam(false);
        setShowSelection(false);
    };

    const onDrop = (event) => {
        event.preventDefault();
        if (isImageFile(event.dataTransfer.files[0])) {
            setImage(URL.createObjectURL(event.dataTransfer.files[0]));
        }
    };

    return (
        <div className="flex flex-col items-center p-10">
          <div
          onClick={() => setShowSelection(true)}
        htmlFor="file-upload"
        className="relative h-[100px] w-[100px] cursor-pointer show-edit rounded-full bg-zinc-400 hover:opacity-80 sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px]">
            <img
          className="h-[100px] w-[100px] rounded-full sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] lg:h-[110px] lg:w-[110px]"
          src={image}
          alt="avatar"

                
            />
            <div className="absolute w-full h-full rounded-full top-0 flex justify-center items-center bg-transparent edit-btn">
          <Edit2 className="m-auto" />
        </div>

            </div>
            {showSelection && (
                <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-md bg-white shadow-xl p-10 m-4">
                        
                        <div
                            onDrop={onDrop}
                            onDragOver={handleDragOver}
                            className="mt-5 border-2 border-dashed border-gray-400 h-60 w-60 flex items-center justify-center text-gray-500"
                        >
                          {image !== "" ? (
                    <img src={image} alt="Image" className= "h-56 w-56"/>
                ) : (
                    "Drop image here"
                )}
                        </div>
                        <Button
                            onClick={() => setShowWebcam(true)}
                            className="mt-5 border-[1px] border-gray-400 hover:border-gray-500"
                            >
                            Capture Image
                        </Button>
                        <Button 
                            onClick={() => setShowSelection(false)}
                            className="mt-5 ml-9 border-[1px] border-gray-400 hover:border-gray-500 text-red-500"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
            {showWebcam && (
                <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-md bg-white shadow-xl p-10">
                        <Webcam
                            audio={false}
                            screenshotFormat="image/jpeg"
                            ref={webcamRef}
                            className="h-60 w-60 rounded-lg"
                        />
                        <br />
                        <Button
                            onClick={onCapture}
                            className="mt-5 border-[1px] border-gray-400 hover:border-gray-500"
                        >
                            Capture photo
                        </Button>
                        <Button 
                            onClick={() => setShowWebcam(false)}
                            className="mt-5 ml-9 border-[1px] border-gray-400 hover:border-gray-500 text-red-500"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
            <input id="file-upload" type="file" accept="image/*" onChange={onImageUpload} className="hidden" />
        </div>
    );
}

export default ImageUploader;
