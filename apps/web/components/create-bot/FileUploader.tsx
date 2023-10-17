import axios from "axios";
import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import UploadCard from "./UploadCard";
import { Button, showToast } from "@calcom/ui";

import FileComponent from "./FileComponent";

export const FileUploader = (): JSX.Element => {
    const [isPending, setIsPending] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    // const { session } = useSupabase();

    // const upload = useCallback(
    //     async (file: File, brainId: string) => {
    //         const formData = new FormData();
    //         formData.append("uploadFile", file);
    //         try {
    //             const response = await axiosInstance.post(
    //                 `/upload?brain_id=${brainId}`,
    //                 formData
    //             );
    //             if (response.data.type === "success") {
    //                 showToast("File uploaded successfully", "success");
    //             } else {
    //                 showToast(JSON.stringify(response.data.message), "error");
    //             }
    //         } catch (e: unknown) {
    //             if (axios.isAxiosError(e) && e.response?.status === 403) {
    //                 showToast(JSON.stringify(
    //                     (
    //                         e.response as {
    //                             data: { detail: string };
    //                         }
    //                     ).data.detail
    //                 ), "warning");
    //             } else {
    //                 showToast("Failed to upload file: " + JSON.stringify(e), "warning");
    //             }
    //         }
    //     },
    //     [session.access_token]
    // );

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

    ///////////////////////////////////////////////////////////////////////////////////

    return (
        <section
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full gap-10 px-6 py-3 outline-none"
        >
            <div className="flex flex-col items-center w-full max-w-3xl gap-5 sm:flex-row">
                <div className="flex-1 w-full">
                    <UploadCard className="flex items-center justify-center h-52">
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center w-full max-w-sm gap-5 p-6 text-center">
                            {isDragActive ? (
                                <p className="text-blue-600">Drop the files here...</p>
                            ) : (
                                <button
                                    onClick={open}
                                    className="h-full transition-opacity opacity-50 cursor-pointer hover:opacity-100 hover:underline"
                                >
                                    Drag and drop files here, or click to browse
                                </button>
                            )}
                        </div>
                    </UploadCard>
                </div>

                {files.length > 0 && (
                    <div className="flex-1 w-full">
                        <UploadCard className="py-3 overflow-y-auto h-52">
                            {files.length > 0 ? (
                                <AnimatePresence mode="popLayout">
                                    {files.map((file) => (
                                        <FileComponent
                                            key={`${file.name} ${file.size}`}
                                            file={file}
                                            setFiles={setFiles}
                                        />
                                    ))}
                                </AnimatePresence>
                            ) : null}
                        </UploadCard>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center justify-center">
                <Button loading={isPending} onClick={() => void uploadAllFiles()}>
                    {isPending ? "Uploading..." : "Upload"}
                </Button>
            </div>
        </section>
    );
};
