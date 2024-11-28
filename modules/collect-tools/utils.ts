import fs from "node:fs/promises";
import path from "node:path";

export const listFiles = async (dir?: string) => {
  const files: string[] = [];
  if (!dir) {
    return [];
  }
  const fileList = await fs.readdir(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    const isFile = (await fs.stat(name)).isFile();
    if (isFile) {
      files.push(name);
    }
  }
  return files;
};