import fs from "fs";
import { join, extname } from "path";
import { readDatabase, writeDatabase } from "@/app/utils";

const uploadDir = join(process.cwd(), "/database/videos.json");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  try {
    const database = readDatabase();
    if (!hash)
      return new Response(JSON.stringify(database), {
        status: 200,
      });
    const video = database.find((v) => v?.hash === hash);
    if (video)
      return new Response(JSON.stringify(video), {
        status: 200,
      });
    else
      return new Response("no video found with the hash given", {
        status: 400,
      });
  } catch (error) {
    console.error("Error getting video:", error);
    return new Response("Error getting video", {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  const formData = await request.json(); // returns a Promise of FormData object

  const database = readDatabase();

  const existingVideoIndex = database.findIndex(
    (v) => v?.hash === formData["hash"]
  );

  if (existingVideoIndex === -1) {
    // Video with the same hash doesn't exist, so add the new video
    database.push(formData);
    writeDatabase(database);
    return Response.json({
      success: true,
      message: "Video added successfully.",
    });
  } else {
    database[existingVideoIndex] = {
      ...database[existingVideoIndex],
      ...formData,
    };
    writeDatabase(database);
    return Response.json({
      success: true,
      message: "Video updated successfully.",
    });
  }
}

export async function DELETE(request: Request) {
  const formData = await request.json(); // returns a Promise of FormData object
  const hash = formData["hash"];
  try {
    const database = readDatabase();
    const filteredDatabase = database.filter((v) => v?.hash !== hash);
    writeDatabase(filteredDatabase);
    return Response.json({
      success: true,
      message: "Data Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return Response.json({ error: "Failed to delete video." });
  }
}
