import React, { useState } from "react";

import { Edit2 } from "@calcom/ui/components/icon";

// import avatar from "../path/to/default/avatar";

function ImageUploader() {
  const [image, setImage] = useState("");

  const onChange = (event) => {
    if (event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <div className="flex flex-col items-center p-10">
      <label
        htmlFor="file-upload"
        className="relative h-[50px] w-[50px] cursor-pointer rounded-full bg-zinc-400 hover:opacity-80 sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] lg:h-[80px] lg:w-[80px]">
        <img
          className="h-[50px] w-[50px] rounded-full sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] lg:h-[80px] lg:w-[80px]"
          src={image}
          alt="avatar"
        />
        <Edit2 className="absolute bottom-0 right-0" />
        <div className="absolute right-0 top-0 p-2" />
      </label>
      <input id="file-upload" type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}

export default ImageUploader;
