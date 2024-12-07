import {
  addImports,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  resolvePath,
  updateTemplates,
} from "nuxt/kit";
import { debounce } from "perfect-debounce";
import camelcase from "camelcase";
import fs from "node:fs/promises";
import path from "node:path";

export interface ToolFileInfo {
  name: string;
  filepath: string;
  targetPath: string;
}

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

const isSub = (parent: string, dir: string) => {
  const relative = path.relative(parent, dir);
  return Boolean(
    relative && !relative.startsWith("..") && !path.isAbsolute(relative)
  );
};

export default defineNuxtModule(async (options, nuxt) => {
  const resolver = createResolver(import.meta.url);
  const buildDir = nuxt.options.buildDir;
  const outDir = "./collect-tools";
  enum contentFiles {
    "names" = "collect-tools/names.ts",
    "list" = "collect-tools/list.ts",
  }
  const contentComponentDirName = "tools";
  const contentComponentPath = await resolvePath(
    `~/components/${contentComponentDirName}`
  );
  let toolFileInfoList: ToolFileInfo[] = [];
  addTemplate({
    filename: contentFiles.list,
    write: true,
    getContents: () => {
      const formatComponentName = (name: string) => {
        const fullName = `${contentComponentDirName}-${name}`;
        const pascalCaseName = camelcase(fullName, {
          pascalCase: true,
        });
        return `${pascalCaseName}`;
      };
      return `import { h } from "vue";
${toolFileInfoList
  ?.map((e) => {
    return `import {${formatComponentName(
      `${e.name}-meta`
    )} } from "#components"`;
  })
  .join(";\n")}
export const list = [
  ${toolFileInfoList
    ?.map((e) => {
      return `{
      name: "${e.name}",
      content:()=>import('${path.join(e.targetPath, "./content.vue")}'),
      meta:${formatComponentName(`${e.name}-meta`)} 
  }`;
    })
    .join(",\n")}
];
`;
    },
  });
  addTemplate({
    filename: contentFiles.names,
    write: true,
    getContents: () => {
      return `
export enum ToolName {
${toolFileInfoList
  .map((e) => {
    return `"${e.name}" = "${e.name}"`;
  })
  .join(",\n")}
}
`;
    },
  });

  const scanFiles = debounce(async () => {
    const files = await listFiles(contentComponentPath);

    toolFileInfoList = files.map((f) => {
      const targetPath = path.relative(path.join(buildDir, outDir), f);
      return {
        name: path.basename(f, path.extname(f)),
        filepath: f,
        targetPath,
      };
    });
    // console.log({ files, toolFileInfoList });

    await updateTemplates({
      filter: (e) =>
        e.filename === contentFiles.list || e.filename === contentFiles.names,
    });
  }, 25);
  addImports([
    {
      name: "getAllTools",
      as: "getAllTools",
      from: resolver.resolve("runtime/list"),
    },
    {
      name: "findTool",
      as: "findTool",
      from: resolver.resolve("runtime/list"),
    },
    {
      name: "ToolName",
      as: "ToolName",
      from: resolver.resolve(`runtime/names`),
    },
  ]);
  await scanFiles();
  nuxt.hook("builder:watch", async (event, changePath) => {
    const srcDir = nuxt.options.srcDir;
    const absoluteChangePath = path.resolve(srcDir, changePath);
    if (isSub(contentComponentPath, absoluteChangePath)) {
      if (
        event === "add" ||
        event === "addDir" ||
        event === "unlink" ||
        event === "unlinkDir"
      ) {
        console.log(
          `collect-tools listen ${absoluteChangePath} ${event}, will restart nuxt`
        );
        return nuxt.callHook("restart");
      }
    }
  });

  nuxt.hook("prerender:routes", async (ctx) => {
    const allRoutes: string[] = toolFileInfoList.map((e) => e.name);
    for (const name of allRoutes) {
      ctx.routes.add(`/tools/${name}`);
    }
    ctx.routes.add(`/tools`);
  });
});
