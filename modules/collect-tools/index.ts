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
        const fullName = `Lazy-${contentComponentDirName}-${name}`;
        const pascalCaseName = camelcase(fullName, {
          pascalCase: true,
        });
        return `${pascalCaseName}`;
      };
      return `import { h } from "vue";
${toolFileInfoList
  ?.map((e) => {
    return `import {${formatComponentName(e.name)} } from "#components"`;
  })
  .join(";\n")}
export const list = [
  ${toolFileInfoList
    ?.map((e) => {
      return `{
      name: "${e.name}",
      // content: () => h(${formatComponentName(e.name)}),
      content:()=>import('${e.targetPath}'),
      meta:${formatComponentName(e.name)}.toolMeta
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
    console.log({ files, toolFileInfoList });

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
  nuxt.hook("builder:watch", async (event, path, ...rest) => {
    // console.log({
    //   event,
    //   path,
    //   rest,
    // });
    // console.log(`collect-tools-watch:${path}`);
    if (path.startsWith(`components/${contentComponentDirName}`)) {
      // console.log(`collect-tools-watch:re scan`);
      scanFiles();
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
