const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

let mainWindow;
let lastPermitCount = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html")); // Fix applied here
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("check-permits", (event, permitCount) => {
  if (permitCount > lastPermitCount) {
    const notification = new Notification({
      title: "New Pending Permits",
      body: `You have ${
        permitCount - lastPermitCount
      } new pending permits to review`,
      icon: path.join(__dirname, "src/assets/LOGO3.png"),
    });

    notification.show();
  }
  lastPermitCount = permitCount;
});
