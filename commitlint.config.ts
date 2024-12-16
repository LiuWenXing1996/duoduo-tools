import { type UserConfig, RuleConfigSeverity } from "@commitlint/types";
import fs from "node:fs/promises";
import path from "node:path";
import { kebabCase } from "change-case";

const listFiles = async (dir?: string) => {
  const files: string[] = [];
  if (!dir) {
    return [];
  }
  const fileList = await fs.readdir(dir);
  for (const file of fileList) {
    if (![".DS_Store"].includes(file)) {
      const name = path.join(dir, file);
      files.push(name);
    }
  }
  return files;
};

export interface ToolFileInfo {
  name: string;
  filepath: string;
}

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": async () => {
      const toolPaths = path.resolve("./components/tools");
      const files = await listFiles(toolPaths);

      const toolFileInfoList: ToolFileInfo[] = files.map((f) => {
        return {
          name: path.basename(f, path.extname(f)),
          filepath: f,
        };
      });
      const toolScopes = toolFileInfoList.map((toolFile) => {
        const name = toolFile.name;
        const scopeName = kebabCase(`tool-${name}`);
        return scopeName;
      });
      return [RuleConfigSeverity.Error, "always", [...toolScopes]];
    },
  },
};

export default Configuration;
