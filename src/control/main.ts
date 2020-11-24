const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(process.cwd(), {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd')
})

let getAppVersionString = function() : string {
    return app.getVersion();
}

let myWindow : any = null;

// Wait until the app is ready
app.once('ready', () => {
    // Create a new window
    myWindow = new BrowserWindow({
        // Set the initial width
        width: 900,
        // Set the initial height
        height: 1100,
        // Set the default background color of the window to match the CSS
        // background color of the page, this prevents any white flickering
        backgroundColor: '#D6D8DC',
        // Don't show the window until it's ready, this prevents any white flickering
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load a URL in the window to the local index.html path
    myWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../gui/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Show window when page is ready
    myWindow.once('ready-to-show', () => {
        myWindow.setTitle('GC Helper V' + getAppVersionString());
        myWindow.show();
    });

    myWindow.webContents.openDevTools()
});