/* eslint-disable */
import { motion } from "framer-motion";
import { Dispatch, forwardRef, RefObject, SetStateAction } from "react";
import { MdClose } from "react-icons/md";

interface FileComponentProps {
    file: File;
    setFiles: Dispatch<SetStateAction<File[]>>;
}

const FileComponent = forwardRef(
    ({ file, setFiles }: FileComponentProps, forwardedRef) => {
        return (
            <motion.div
                initial={{ x: "-10%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "10%", opacity: 0 }}
                layout
                ref={forwardedRef as RefObject<HTMLDivElement>}
                className="relative flex flex-row gap-1 px-6 py-2 overflow-hidden leading-none border-b dark:bg-black last:border-none border-black/10 dark:border-white/25"
            >
                <div className="flex flex-1">
                    <div className="flex flex-col">
                        <span className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                            {file.name}
                        </span>
                        <span className="overflow-hidden text-xs opacity-50 text-ellipsis">
                            {(file.size / 1000).toFixed(3)} kb
                        </span>
                    </div>
                </div>
                <button
                    role="remove file"
                    className="absolute top-0 right-0 flex items-center justify-center h-full p-3 text-xl text-red-500 bg-white shadow-md text-ellipsis dark:bg-black aspect-square"
                    onClick={() =>
                        setFiles((files) => files.filter((f) => f.name !== file.name))
                    }
                >
                    <MdClose />
                </button>
            </motion.div>
        );
    }
);

FileComponent.displayName = "FileComponent";

export default FileComponent;
