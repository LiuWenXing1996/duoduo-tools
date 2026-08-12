import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.whenReady().then(() => {
  const win = new BrowserWindow({
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
    },
  });
  win.webContents.openDevTools();

  const distPath = path.join(__dirname, "../.output");
  win.loadFile(path.join(distPath, "public/index.html"));
  // win.webContents.openDevTools();
});
