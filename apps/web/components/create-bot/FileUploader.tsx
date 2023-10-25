import { Upload } from "lucide-react";
import { useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { useLocale } from "@calcom/lib/hooks/useLocale";

import { Button, showToast, InputField, Select } from "@calcom/ui";

const FileBotUploader = () => {
    const { t } = useLocale();
    const [isPending, setIsPending] = useState(false);
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            showToast("File too big.", "warning");
            return;
        }

        for (let i = 0; i < acceptedFiles.length; i++) {
            const file = acceptedFiles[i];
            const isAlreadyInFiles =
                files.filter((f) => f.name === file.name && f.size === file.size)
                    .length > 0;
            if (isAlreadyInFiles) {
                showToast(`${file.name} was already added`, "warning");
                acceptedFiles.splice(i, 1);
            }
        }
        setFiles((files) => [...files, ...acceptedFiles]);
    };

    const uploadAllFiles = async () => {
        if (files.length === 0) {
            showToast("Please, add files to upload", "warning");
            return;
        }
        setIsPending(true);
        // if (currentBrainId !== undefined) {
        //     await Promise.all(files.map((file) => upload(file, currentBrainId)));
        //     setFiles([]);
        // } else {
        showToast("Please, select or create a brain to upload a file", "warning");
        // }
        setIsPending(false);
    };

    const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
        onDrop,
        noClick: true,
        maxSize: 100000000, // 1 MB
    });

    return (
        <>
            <Select
                // options={expertOptions}
                // components={{
                //     Option: (props) => {
                //         return (
                //             <components.Option {...props}>
                //                 <CustomOption
                //                     icon={props.data.avatar}
                //                     value={props.data.value}
                //                     label={props.data.label}
                //                     added={props.data.added}
                //                 />
                //             </components.Option>
                //         );
                //     },
                // }}
                isSearchable={true}
                // filterOption={customFilter}
                className="w-full rounded-md text-[.5rem] sm:text-sm"
            // onChange={(event) => {
            //     console.log(event);
            //     setAddExpertId(event?.added ? -1 : event?.value || -1);
            // }}
            // onInputChange={(value) => {
            //     handleExpertSearch(value);
            // }}
            />
            <div {...getRootProps()} className="flex flex-col items-center justify-center p-20 mb-4 font-sans border-2 border-dotted rounded-md border-emphasis md:my-6 ">
                <div className="flex items-center w-16 h-16 mb-4 rounded-full bg-emphasis">
                    <Upload className="mx-auto text-secondary h-9 w-9" />
                </div>
                <h1 className="mb-8 text-2xl font-medium text-center">{t("expertgpt_upload_description")}</h1>
                <p className="mx-4 mb-2 text-center break-words text-subtle text-md md:mx-14 md:mb-8">{t("upload_file_bot_description")}</p>
                <input {...getInputProps()} />
                <div className="flex justify-center w-full py-4 mb-5 border-2 border-dotted rounded-lg cursor-pointer border-pink" onClick={open}>{isDragActive ? "Drop the files here..." : "Drag and drop files here, or click to browse"}</div>
                <div className="flex flex-col items-center justify-center">
                    <Button loading={isPending} onClick={() => void uploadAllFiles()}>
                        {isPending ? "Uploading..." : "Upload"}
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-around text-[#B99BC8]">
                <hr className="w-[40%] border-[#B99BC8]" />
                <p>or</p>
                <hr className="w-[40%] border-[#B99BC8]" />
            </div>
            <div className="flex items-end justify-center gap-8 mt-7">
                <InputField
                    name="Enter a website URL"
                />
                <Button className="mb-2">Crawl</Button>
            </div>
        </>
    );
};

export default FileBotUploader;