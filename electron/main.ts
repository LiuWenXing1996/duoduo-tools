import { app, BrowserWindow } from "electron";

app.whenReady().then(() => {
  const win = new BrowserWindow();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    console.log("VITE_DEV_SERVER_URL", process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
});
