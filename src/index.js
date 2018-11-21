
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
      let filePath=[];
    for (let f of e.dataTransfer.files) {
        filePath.push(f.path)
        console.log('File(s) you dragged here: ', f.path)
    }
    parseFiles(filePath);
  });

  document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // -- The function gets an array of file paths
  function parseFiles(filePaths){
    let files = [];

    //for(let i = 1; i< filePaths.length; i++){
      //fs.appendFileSync(filePaths[0],filePaths[i]);
    //};
   
    for(let path of filePaths){
      let rawData = [];
      // -- Read raw points file
       let otherData = fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line){
         rawData.push(line);});
        files.push(rawData);
    };
    let finalFiles = [];
    for(let i = 1; i< files.length; i++){
      files[0] = files[0].concat(files[i]);
      console.log(files);
    };


    const parser = new Parser(files[0],species,filePaths[0]);
    parser.generateFiles();

   // return rawData;
  }


  