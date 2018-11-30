const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
        electron:path.join(__dirname,'../node_modules',',bin','electron')
    })
}



const shell = require('electron').shell
const ipc = require('electron').ipcMain
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 , title:'TFC', icon:path.join(__dirname,'/assets/icons/win/icon.ico')})
  
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    // and load the index.html of the app.
    //win.loadFile('src/index.html')
  
    // Open the DevTools.
    win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
        app.quit();
    })
  
    let menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
              {
                  label: 'shiskin.com',
                  click(){
                      shell.openExternal('http://shiskin.com')
                  }
              },
              {type: 'separator'},
                {
                    label: 'Tree File Creator',
                    accelerator: 'Ctrl+T',
                    click(){
                      createTreeFileCreatorWindow();
                    }
                  },
              {
                  label: 'Project Directory Creator',
                  accelerator: 'Ctrl+P',
                  click(){
                    projectDirectoryCreatorWindow();
                  }
              },
              {
                  label: 'Exit',
                  click(){ 
                      app.quit()
                  }
              }
            ]
        },{
            label:'Help',
            submenu: [
                {
                    label: 'Tree File Creator',
                    accelerator: 'Ctrl+H+T',
                    click(){
                      console.log('Open Tree file creator help');
                    }
                },
                {
                    label: 'Project Directory Creator',
                    accelerator: 'Ctrl+H+P',
                    click(){
                       console.log('Open Project Directory Creator help')
                    }
                }
              ]
        }
    ])
    Menu.setApplicationMenu(menu)
  }

  function createTreeFileCreatorWindow () {
    // Create the browser window.
    tfcWindow = new BrowserWindow({ width: 600, height: 400 , title:'Tree File Creator', icon:path.join(__dirname,'/assets/icons/win/icon.ico')})
    tfcWindow.setMenu(null)
    tfcWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/views/treeFileCreator.html'),
        protocol: 'file',
        slashes: true
    }))
    // Emitted when the window is closed.
    tfcWindow.on('closed', () => {
        tfcWindow = null
    })
    
}

function projectDirectoryCreatorWindow () {
    // Create the browser window.
    pdcWindow = new BrowserWindow({ width: 600, height: 400 , title:'Project Directory Creator', icon:path.join(__dirname,'/assets/icons/win/icon.ico')})
    pdcWindow.setMenu(null)
    pdcWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src/views/projectDirectoryCreator.html'),
        protocol: 'file',
        slashes: true
    }))
    // Emitted when the window is closed.
    pdcWindow.on('closed', () => {
        pdcWindow = null
    })
    
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

ipc.on('parse-file', function(event, arg){
    win.webContents.send('filePath',arg)
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.