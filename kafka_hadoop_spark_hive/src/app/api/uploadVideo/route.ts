import fs from "fs";
import { join, extname } from "path";
import { nanoid } from "nanoid";
import crypto from "crypto";
import axios from "axios";

var MP4Box = require("mp4box"); // Or whatever import method you prefer.
const path = require("path");

const uploadDir = join(process.cwd(), "source/videos");
const resultDir = join(process.cwd(), "source/result");

export async function GET() {
  return Response.json({ hello: "world" });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const metadata: { filename: string; hash: string; metadata: any }[] = [];

  // Check if the directory exists
  if (!fs.existsSync(uploadDir)) {
    // If it doesn't exist, create it
    fs.mkdirSync(uploadDir, { recursive: true }); // { recursive: true } ensures parent directories are created if they don't exist
    console.log(`Folder '${uploadDir}' created successfully.`);
  } else {
    console.log(`Folder '${uploadDir}' already exists.`);
  }
  // Check if the directory exists
  if (!fs.existsSync(resultDir)) {
    // If it doesn't exist, create it
    fs.mkdirSync(resultDir, { recursive: true }); // { recursive: true } ensures parent directories are created if they don't exist
    console.log(`Folder '${resultDir}' created successfully.`);
  } else {
    console.log(`Folder '${resultDir}' already exists.`);
  }

  try {
    //@ts-expect-error
    for (const [name, file] of formData?.entries()) {
      const extension = extname(file.name); // Get the file extension
      const hash = crypto.createHash("sha256");

      // Read the file data into a Buffer
      const fileData = await file.arrayBuffer();
      const buffer = Buffer.from(fileData);

      hash.update(buffer);
      const fileHash = hash.digest("hex");

      const filePath = join(uploadDir, `${name}_${fileHash}${extension}`); // Define the path for the file
      fs.writeFileSync(filePath, Buffer.from(fileData));

      var arrayBuffer = new Uint8Array(fs.readFileSync(filePath)).buffer;

      arrayBuffer.fileStart = 0;

      var mp4boxfile = MP4Box.createFile();
      var mp4boxfile = MP4Box.createFile();

      mp4boxfile.onReady = function (info) {
        const { created, duration, tracks } = info;
        const dimentions = tracks[0].video;
        const codec = tracks[0].codec;
        metadata.push({
          filename: `${name}_${fileHash}${extension}`,
          hash: fileHash,
          metadata: {
            created,
            uploaded: new Date(),
            duration,
            dimentions,
            codec,
          },
        });
      };

      mp4boxfile.appendBuffer(arrayBuffer);
      mp4boxfile.flush();

      console.log(`File saved: ${name}`);
    }
    metadata.forEach(async (videoMeta) => {
      const s = await axios
        .post("http://localhost:3001/api/videoData", videoMeta)
        .then((r) => r.data);
      console.log(s);
    });

    return new Response("Videos uploaded successfully.");
  } catch (error) {
    console.error("Error uploading videos:", error);
    return new Response("VFailed to upload videos.", {
      status: 500,
    });
  }
}

async function extractMetadata(filepath: string) {}
