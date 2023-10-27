import axios from "axios";
import { Upload } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { components } from "react-select";
import { z } from "zod";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { trpc } from "@calcom/trpc/react";
import { Avatar, Button, showToast, InputField, Select } from "@calcom/ui";

import { MinimalBrainEntity } from "@components/create-bot/BrainType";

const FileBotUploader = () => {
  const { t } = useLocale();
  const { data: user, isLoading } = trpc.viewer.me.useQuery();
  const [isPending, setIsPending] = useState(false);
  const [isCrawling, setCrawling] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [currentBrainId, setCurrentBrainId] = useState("");
  const [crawlUrl, setCrawlUrl] = useState("");
  const [botOptions, setBotOptions] = useState<z.infer<typeof MinimalBrainEntity>[]>([]);
  const [allBrains, setAllBrains] = useState<z.infer<typeof MinimalBrainEntity>[]>([]);

  const upload = useCallback(
    async (file: File, brainId: string) => {
      const formData = new FormData();
      formData.append("uploadFile", file);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/upload?brain_id=${brainId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );
        showToast(
          (response.data.type === "success" ? "File uploaded successfully: " : "") +
            JSON.stringify(response.data.message),
          "success"
        );
      } catch (e: unknown) {
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          showToast(
            `${JSON.stringify(
              (
                e.response as {
                  data: { detail: string };
                }
              ).data.detail
            )}`,
            "error"
          );
        } else {
          showToast("Failed to upload file: " + JSON.stringify(e), "error");
        }
      }
    },
    [user, showToast]
  );

  const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      showToast("File too big.", "warning");
      return;
    }

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const isAlreadyInFiles = files.filter((f) => f.name === file.name && f.size === file.size).length > 0;
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
    if (currentBrainId !== "") {
      await Promise.all(files.map((file) => upload(file, currentBrainId)));
      setFiles([]);
    } else {
      showToast("Please, select or create a brain to upload a file", "warning");
    }
    setIsPending(false);
  };

  const { getInputProps, getRootProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true,
    maxSize: 100000000, // 1 MB
  });

  const crawlWebsite = useCallback(
    async (brainId: string | undefined) => {
      const url = crawlUrl !== "" ? crawlUrl : null;

      // Configure parameters
      const config = {
        url: url,
        js: false,
        depth: 1,
        max_pages: 100,
        max_time: 60,
      };

      setCrawling(true);

      try {
        console.log("Crawling website...", brainId);
        if (brainId !== "") {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/crawl?brain_id=${brainId}`,
            config,
            {
              headers: {
                Authorization: `Bearer ${user?.apiKey}`,
                "Content-Type": "application/json",
              },
            }
          );

          showToast(response.data.message, "success");
        }
      } catch (error: unknown) {
        showToast("Failed to crawl website: " + JSON.stringify(error), "error");
      } finally {
        setCrawling(false);
      }
    },
    [user, showToast]
  );

  const handleBotSearch = async (value: string) => {
    const data = [];

    if (value) {
      for (const bot of allBrains) {
        if (isLoading) continue;
        if (bot.name.includes(value)) {
          data.push(bot);
        }
      }
    }

    setBotOptions(data);
  };

  const CustomOption = ({ icon, label }: { icon: string; label: string }) => {
    return (
      <div className="flex items-center">
        {icon ? <Avatar className="mr-2" alt="Nameless" size="sm" imageSrc={icon} /> : <></>}
        <span>{label}</span>
      </div>
    );
  };

  useEffect(() => {
    if (isLoading) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_BRAIN_SERVICE}/brains`, {
        headers: {
          Authorization: `Bearer ${user?.apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        setAllBrains(data.data.brains);
      });
  }, [user]);

  return (
    <>
      <Select
        options={botOptions}
        components={{
          Option: (props) => {
            return (
              <components.Option {...props}>
                <CustomOption icon="" label={props.data.name} />
              </components.Option>
            );
          },
        }}
        isSearchable={true}
        className="w-full rounded-md text-[.5rem] sm:text-sm"
        onChange={(event) => {
          console.log(event);
          setCurrentBrainId(event?.id ? event?.id : "");
        }}
        onInputChange={(value) => {
          handleBotSearch(value);
        }}
      />
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center p-20 mb-4 font-sans border-2 border-dotted rounded-md border-emphasis md:my-6 ">
        <div className="flex items-center w-16 h-16 mb-4 rounded-full bg-emphasis">
          <Upload className="mx-auto text-secondary h-9 w-9" />
        </div>
        <h1 className="mb-8 text-2xl font-medium text-center">{t("expertgpt_upload_description")}</h1>
        <p className="mx-4 mb-2 text-center break-words text-subtle text-md md:mx-14 md:mb-8">
          {t("upload_file_bot_description")}
        </p>
        <input {...getInputProps()} />
        <div
          className="flex justify-center w-full py-4 mb-5 border-2 border-dotted rounded-lg cursor-pointer border-pink"
          onClick={open}>
          {isDragActive ? "Drop the files here..." : "Drag and drop files here, or click to browse"}
        </div>
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
          value={crawlUrl}
          onChange={(e) => setCrawlUrl(e.target.value)}
        />
        <Button loading={isCrawling} className="mb-2" onClick={() => crawlWebsite(currentBrainId)}>
          Crawl
        </Button>
      </div>
    </>
  );
};

export default FileBotUploader;
