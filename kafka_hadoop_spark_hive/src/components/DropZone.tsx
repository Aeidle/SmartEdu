/* eslint-disable react/display-name */
"use client";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

interface DropZoneParams {
  className: string;
  action: () => void;
}

export interface DropZoneRef {
  getFiles: () => Array<File>;
  deleteFiles: () => void;
  action: () => void;
}

const Dropzone = React.forwardRef<DropZoneRef, DropZoneParams>(
  ({ className, action }, ref) => {
    const [files, setFiles] = useState<Array<any>>([]);
    const [rejected, setRejected] = useState<Array<any>>([]);

    const removeFile = (index: number) => {
      setFiles((prev) => prev.filter((_, i) => i != index));
    };

    const onDrop = useCallback((acceptedFiles: any, rejectedFiles: any) => {
      if (acceptedFiles?.length) {
        setFiles(acceptedFiles);
        console.log("dropped");
      }

      if (rejectedFiles?.length) {
        setRejected(rejectedFiles);
        console.log("rejected");
      }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "video/x-msvideo": [],
        "video/mp4": [],
        "video/mpeg": [],
        "video/ogg": [],
        "video/mp2t": [],
        "video/webm": [],
      },
      maxFiles: 10,
      onDrop,
    });

    useEffect(() => {
      // Revoke the data uris to avoid memory leaks
      console.log(files, "effect files");
      return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, [files]);

    const getFiles = useCallback(() => {
      return files;
    }, [files]);
    const deleteFiles = useCallback(() => {
      console.log("worked");
      setFiles([]);
      setRejected([]);
    }, []);

    useImperativeHandle(ref, () => ({ getFiles, action, deleteFiles }), [
      getFiles,
      action,
      deleteFiles,
    ]);

    return (
      <>
        <div
          {...getRootProps({
            className: className,
          })}
        >
          <input {...getInputProps({ name: "file" })} />
          <div className="flex flex-col items-center justify-center gap-4">
            <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop files here, or click to select files</p>
            )}
          </div>
        </div>
        {(!!files.length || !!rejected.length) && (
          <section className="mt-10 w-full">
            <div className="flex gap-4">
              <h2 className="text-stone-700 text-3xl font-semibold">Preview</h2>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setRejected([]);
                }}
                className="mt-1 rounded-xl   border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
              >
                Remove all files
              </button>
              <button
                type="submit"
                className="ml-auto mt-1 rounded-xl border border-purple-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-purple-400 hover:text-white disabled:opacity-40"
                disabled={files.length === 0 || !files}
                onClick={action}
              >
                Upload to the Server
              </button>
            </div>

            {/* Accepted files */}
            {!!files.length && (
              <>
                <h3 className="title mt-10 border-b pb-3 text-lg font-semibold text-stone-600">
                  Accepted Files
                </h3>
                <ul className="mt-6 gap-3 grid grid-cols-3">
                  {files.map(async (file, i) => (
                    <VideoThumbnail
                      key={file.name}
                      index={i}
                      file={file}
                      removeFile={removeFile}
                    />
                  ))}
                </ul>
              </>
            )}

            {/* Rejected Files */}
            {!!rejected.length && (
              <>
                <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-stone-600">
                  Rejected Files
                </h3>
                <ul className="mt-6 flex flex-col">
                  {rejected.map(({ file, errors }) => (
                    <li
                      key={file.name}
                      className="relative p-4 flex justify-between rounded-md shadow-lg bg-red-200"
                    >
                      <div>
                        <p className="mt-2 text-sm font-medium text-stone-500">
                          {file.name}
                        </p>
                        <ul className="text-[12px] text-red-400">
                          {errors.map((error: any) => (
                            <li key={error.code}>{error.message}</li>
                          ))}
                        </ul>
                      </div>
                      <button
                        type="button"
                        className="mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                        onClick={() => setRejected([])}
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
        {/* Preview */}
      </>
    );
  }
);

const VideoThumbnail = async ({
  file,
  removeFile,
  index,
}: {
  file: File;
  removeFile: (i: number) => void;
  index: number;
}) => {
  const [thumbnail, setThumbnail] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const generateThumbnail = async () => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const videoBlob = new Blob([reader.result], { type: file.type });
          const video = document.createElement("video");
          const videoUrl = URL.createObjectURL(videoBlob);
          video.src = videoUrl;

          video.onloadedmetadata = () => {
            const duration = video.duration;
            setVideoDuration(duration);
            const middleTime = duration / 2;
            video.currentTime = middleTime;
            video.onseeked = () => {
              const canvas = document.createElement("canvas");
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              canvas
                .getContext("2d")
                ?.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL("image/jpeg");

              // Set the thumbnail state
              setThumbnail(thumbnail);

              // Clean up
              URL.revokeObjectURL(videoUrl);
            };
          };
        }
      };
      reader.readAsArrayBuffer(file);
    };

    generateThumbnail();

    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [file, thumbnail]);

  return (
    <li
      key={file.name}
      className="flex-1 relative rounded-lg overflow-clip hover:scale-[.975] hover:border hover:border-white transition-all duration-200"
    >
      <Image
        src={thumbnail}
        alt="video_tumbnail"
        className="w-full "
        width={200}
        height={100}
      />
      <div className="absolute p-2 inset-0 flex flex-col justify-between bg-gradient-to-t from-stone-900 via-stone-900/50 to-stone-900/0">
        <div className="flex justify-end">
          <XCircleIcon
            onClick={() => removeFile(index)}
            className="w-8 text-red-500 cursor-pointer"
          />
        </div>

        <div className="flex justify-between">
          <span className="text-white font-medium inline-block whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]">
            {file.name}
          </span>
          <span className="text-stone-300 font-medium">
            {(videoDuration / 100).toFixed(2).toString().split(".").join(":")}
          </span>
        </div>
      </div>
    </li>
  );
};

export default Dropzone;
