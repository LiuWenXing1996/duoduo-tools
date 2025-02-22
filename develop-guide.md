# 开发指南

## 前期准备

### 开发环境

- node 
- pnpm
- git
- vscode(可选)，其他编辑器也可以

### 技术栈

- TypeScript
- [Vue3](https://cn.vuejs.org/)
- [Nuxt3](https://nuxt.com.cn/)
- [TailwindCSS](https://tailwindcss.com/)
- [Naive-Ui](https://www.naiveui.com/zh-CN/os-theme)
- [Less](https://lesscss.org/)

## 项目初始化

### 克隆项目

```bash
git clone https://github.com/LiuWenXing1996/duoduo-tools.git
```
### 安装依赖
```bash
pnpm install
```
### 启动项目
```bash
pnpm dev
```
访问 http://localhost:3000/tools, 即可看到项目页面

## 项目结构

本项目基于`Nuxt3`开发，项目结构和`Nuxt3`一致，请先阅读`Nuxt3`中的[目录结构](https://nuxt.com.cn/docs/guide)一节。

一些自定义的`nuxt-modules`
- `./modules/auto-import-types`：自动导入一些组件暴露的`TypeScript`类型，如`Props` 、`Slots`等
- `./modules/collect-tools`：自动搜索工具的实现，并自动注册到项目中，无需手动注册,同时也提供了一些比较有用的`TypeScript`类型,如`ToolName`等
- `./modules/custom-icons`：自动收集项目的 svg 图标，并自动注册到项目中，无需手动注册

一些约定的目录
- `./components`：组件目录
- `./components/tools/xxx`：工具实现目录，`xxx`为工具名称，如`base64`、`uuid`等
- 其余的目录可以参照`Nuxt3`的目录结构
  
## 单个工具目录结构

一个工具的目录结构如下：
```bash
├── tool-name
├── ├── content.vue
├── ├── meta.ts
```

`content.vue`为工具的实现，`meta.ts`为工具的元数据，如工具的名称、描述等。

`content.vue`的示例
```vue
<template>
    // 根组件必须是 tool-content 组件
    <tool-content>
        <template #input>
            // 可以自定义一些输入表单
        </template>
        <template #output>
            // 可以自定义一些输出结果
        </template>
    </tool-content>
</template>
```

`meta.ts`的示例

```ts
// 必须使用 defineToolMeta 函数来定义工具的元数据，并默认导出
export default defineToolMeta({
  title: "工具名称",
  description: `工具描述`,
  category: ToolCategory.dev,
});
```

## 开发流程
- 创建分支
- 创建工具目录

    运行以下命令，按照提示创建工具目录
    ```bash
    pnpm create-code
    ```
    请注意，选择的工具生成路径需要在`./components/tools`下
- 实现工具
- 提交代码
  - 运行 `git add`
  - 然后运行 `pnpm commit`，按照提示填写提交信息
    - 如果本次更改仅涉及到单个工具，请在`scope`中填写工具的名称，工具的名称为`tool-[工具目录的名称]`,如`tool-date-transfer`
  - 最后运行 `git push`
- 发布
  - 本仓库绑定了`Vercel`，每次提交代码后，会自动发布到`Vercel`，可以在`Vercel`中查看发布状态，如果想要自定义部署，可以参考`Nuxt3`的文档    