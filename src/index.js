
const fs = require('fs');
const electron = require('electron')
const path = require('path')
const species = require('../assets/js/species.json');
const BrowserWindow = electron.remote.BrowserWindow
const remote = electron.remote
const ipc = electron.ipcRenderer

let filePath = '';

//const BrowserWindow = electron.remote.BrowserWindow
/*
const generateBtn = document.getElementById('generateBtn')
 
generateBtn.addEventListener('click', function(){
    parser.generateFiles(filePath, species)
    ipc.send('generate-files', filePath)//document.getElementById('generateBtn').value)
    console.log(filePath)
})
*/
document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    
    for (let f of e.dataTransfer.files) {
        filePath = f.path
        console.log('File(s) you dragged here: ', f.path)
    }
    parseFiles(filePath);
  });

  document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  function parseFiles(path){
    let rawData = [];
    // -- Read raw points file
    let otherData = fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line){
    rawData.push(line);
    });
    const parser = new Parser(rawData,species,filePath);
    //parser.generateFiles();

    return rawData;
  }


  