const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');

const NOTES_FILENAME = 'notes.json';

const ensureNotesFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ content: '', updatedAt: null, launchAtLogin: true }, null, 2)
    );
  }
};

const getNotesPath = () => path.join(app.getPath('userData'), NOTES_FILENAME);

const loadNotesFile = async () => {
  const notesPath = getNotesPath();
  ensureNotesFile(notesPath);
  const raw = await fs.promises.readFile(notesPath, 'utf-8');
  return JSON.parse(raw);
};

const saveNotesFile = async (payload) => {
  const notesPath = getNotesPath();
  await fs.promises.writeFile(notesPath, JSON.stringify(payload, null, 2));
};

const applyLaunchAtLogin = (enabled) => {
  app.setLoginItemSettings({
    openAtLogin: Boolean(enabled),
    path: process.execPath
  });
};

const createWindow = () => {
  const win = new BrowserWindow({
    width: 420,
    height: 560,
    alwaysOnTop: true,
    resizable: true,
    transparent: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.setAlwaysOnTop(true, 'floating');
  win.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(async () => {
  nativeTheme.themeSource = 'light';

  const data = await loadNotesFile();
  applyLaunchAtLogin(data.launchAtLogin !== false);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('load-notes', async () => {
  return loadNotesFile();
});

ipcMain.handle('save-notes', async (_event, payload) => {
  await saveNotesFile(payload);
  if (typeof payload.launchAtLogin === 'boolean') {
    applyLaunchAtLogin(payload.launchAtLogin);
  }
  return { ok: true };
});
