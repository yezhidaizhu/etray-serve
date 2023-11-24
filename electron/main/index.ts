import { app, BrowserWindow, shell, ipcMain, Tray, Menu } from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";

import createServer from "./server/index";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

let tray = null;
function init() {
  // 第一次启动
  createServer();

  tray = new Tray(join(process.env.VITE_PUBLIC, "tary.ico"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "重动打印服务",
      click: () => {
        createServer();
      },
    },
    { type: "separator" },
    { label: "退出", role: "quit" },
  ]);
  tray.setToolTip("滴滴打印服务.");
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(init);

app.on("activate", () => {});
