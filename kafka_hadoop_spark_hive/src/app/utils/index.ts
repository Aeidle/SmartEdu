// utils/database.js
import fs from "fs";
import path from "path";

const databaseFile = path.join(process.cwd(), "database/videos.json");

export function readDatabase() {
  try {
    const data = fs.readFileSync(databaseFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or cannot be read, return an empty array
    return [];
  }
}

export function writeDatabase(data: any) {
  console.log("data", data);
  fs.writeFileSync(databaseFile, JSON.stringify(data, null, 2));
}
