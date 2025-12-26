// electron-main.js (CommonJS)
const { app, BrowserWindow, ipcMain,nativeImage  } = require('electron');
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
    //初始位置
    x: 0,
    y: 0,

    width: 1010,
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
  if (process.env.DEV) {
    if (process.env.DEBUGGING) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(currentDir, 'index.html'));
    // 生产环境禁止打开 DevTools
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    createThumbarButtons()
  })
}

/**
 * 缩略图工具栏
 */
function createThumbarButtons() {
  if (!mainWindow) return

  const makeIcon = (name) =>
    nativeImage
      .createFromPath(
        path.join(currentDir, `assets/icon/thumbar/${name}.png`)
      )
      .resize({ width: 32, height: 32 })

  mainWindow.setThumbarButtons([
    {
      tooltip: '上一首',
      icon: makeIcon('prev'),
      click: () => mainWindow.webContents.send('media-prev')
    },
    {
      tooltip: '播放',
      icon: makeIcon('play'),
      click: () => mainWindow.webContents.send('media-play')
    },
    {
      tooltip: '下一首',
      icon: makeIcon('next'),
      click: () => mainWindow.webContents.send('media-next')
    }
  ])
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
