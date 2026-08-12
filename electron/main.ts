import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
// 必须在 app ready 之前调用
app.disableHardwareAcceleration()

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

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    const distPath = path.join(__dirname, "../.output");
    win.loadFile(path.join(distPath, "public/index.html"));
  }
});
