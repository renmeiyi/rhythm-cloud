// electron-main.js (CommonJS)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');

// 兼容 Linux 下 process 未定义的情况
const platform = process.platform || os.platform();

// 当前目录
const currentDir = __dirname;

let mainWindow;

// 创建窗口
function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // 托盘图标
    width: 1000,
    height: 600,
    useContentSize: true,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION
        )
      )
    }
  });

    mainWindow.loadURL(process.env.APP_URL);
  // if (process.env.DEV) {
  //   if (process.env.DEBUGGING) {
  //     mainWindow.webContents.openDevTools();
  //   }
  // } else {
  //   mainWindow.loadFile(path.join(currentDir, 'index.html'));
  //   // 生产环境禁止打开 DevTools
  //   mainWindow.webContents.on('devtools-opened', () => {
  //     mainWindow.webContents.closeDevTools();
  //   });
  // }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App 初始化
app.whenReady().then(createWindow);

// Mac 特殊行为
app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (!mainWindow) {
    createWindow();
  }
});

// ------------------- IPC 窗口控制 -------------------
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});
