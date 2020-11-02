"use strict";
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var path = require('path');
var url = require('url');
require('electron-reload')(process.cwd(), {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron.cmd')
});
var getAppVersionString = function () {
    return app.getVersion();
};
var myWindow = null;
app.once('ready', function () {
    myWindow = new BrowserWindow({
        width: 900,
        height: 1100,
        backgroundColor: '#D6D8DC',
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    myWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    myWindow.once('ready-to-show', function () {
        myWindow.setTitle('GC Helper V' + getAppVersionString());
        myWindow.show();
    });
});
//# sourceMappingURL=main.js.map