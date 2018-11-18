
//const { app, BrowserWindow, Menu} = require('electron')
const species = require('/code/electron/TreeFileCreator/assets/js/species.json');
const Stack = require('/code/electron/TreeFileCreator/assets/js/stack');
const parser = require('/code/electron/TreeFileCreator/assets/js/parser');
let Parser = new parser();
var fs = require('fs');

const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const remote = electron.remote
const ipc = electron.ipcRenderer

let filePath = '';

//const BrowserWindow = electron.remote.BrowserWindow

const generateBtn = document.getElementById('generateBtn')
 
generateBtn.addEventListener('click', function(){
    Parser.generateFiles(filePath, species)
    ipc.send('generate-files', filePath)//document.getElementById('generateBtn').value)
    console.log(filePath)
})

document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    for (let f of e.dataTransfer.files) {
        filePath = f.path
        console.log('File(s) you dragged here: ', f.path)
    }
  });

  document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  function readTreeFile(path){
    let rawData = [];
    let otherData = fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line){
    rawData.push(line);
    });
    return rawData;
  }