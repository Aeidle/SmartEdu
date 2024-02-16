import { NextResponse } from "next/server";
import fs from "fs";
import { join } from "path";

const CHUNK_SIZE = 1000000; // 1MB

async function getVideoStream(req, id, edit) {
  const range = req.headers.get("range");

  if (!range) {
    return new Response("Range header missing", { status: 400 });
  }

  let uploadDir = join(process.cwd(), "source/videos");
  let filePath = join(uploadDir, `video_${id}.mp4`); // Define the path for the file

  if (edit) {
    uploadDir = join(process.cwd(), "source/result");
    filePath = join(uploadDir, `output_video___${id}.mp4`); // Define the path for the file
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const chunkStart = Number(range.replace(/\D/g, "")) || 0;
  const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, fileSize - 1);

  const contentLength = chunkEnd - chunkStart + 1;

  const headers = {
    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength.toString(),
    "Content-Type": "video/mp4",
  };

  const videoStream = fs.createReadStream(filePath, {
    start: chunkStart,
    end: chunkEnd,
  });
  const response = new Response(videoStream, { status: 206, headers });

  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  let edit_raw = searchParams.get("edit");
  const edit = !!edit_raw;

  console.log(`streaming ${hash} , with edit = ${edit}`);
  try {
    return await getVideoStream(request, hash, edit);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
