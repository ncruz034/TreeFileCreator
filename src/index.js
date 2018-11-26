
const fs = require('fs');
const electron = require('electron')
const path = require('path')
const species = require('../assets/js/species.json');
const BrowserWindow = electron.remote.BrowserWindow
const remote = electron.remote
const ipc = electron.ipcRenderer

let filePaths = [];
//let lastPointNumber = 0;
//const BrowserWindow = electron.remote.BrowserWindow
/*
const generateBtn = document.getElementById('generateBtn')
 
generateBtn.addEventListener('click', function(){
    parser.generateFiles(filePath, species)
    ipc.send('generate-files', filePath)//document.getElementById('generateBtn').value)
    console.log(filePath)
})
*/
const generateSingleFileBtn = document.getElementById('runSingleFile')
 
generateSingleFileBtn.addEventListener('click', function(){
  if(filePaths.length > 0)
    parseSingleFile(filePaths[0])
})


const generateMultipleFilesToOneBtn = document.getElementById('runMultipleFilesToOne')
 
generateMultipleFilesToOneBtn.addEventListener('click', function(){
  if(filePaths.length > 0)
    parseMultipleFilesToOne(filePaths)  
})


const generateSecondFileOnly = document.getElementById('runSecondFileOnly')
 
generateSecondFileOnly.addEventListener('click', function(){
  if(filePaths.length > 0)
    parseSecondFileOnly(filePaths)  
})

document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    //filePaths=[];
    for (let f of e.dataTransfer.files) {
        filePaths.push(f.path)
        console.log('File(s) you dragged here: ', f.path)
    }
    e.dataTransfer.items.clear();
    console.log(filePaths);
  });

  document.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  // -- The function gets an array of file paths
  function parseMultipleFilesToOne(paths){
    let files = [];

    for(let path of paths){
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

    const parser = new Parser(files[0],species,paths[0],0);
    parser.generateFiles();
    filePaths = [];
  }


  // -- The function gets an array of file paths
  function parseSingleFile(paths){
    let files = [];
    console.log(paths)
      let rawData = [];
      // -- Read raw points file
       let otherData = fs.readFileSync(paths, 'utf-8').split(/\r?\n/).forEach(function(line){rawData.push(line);});
       files.push(rawData);
    
    const parser = new Parser(files[0],species,paths,0);
    parser.generateFiles();
    filePaths = [];
  }

  function parseSecondFileOnly(paths){
    let files = [];
    let isTxt = false;
    let txtPath = '';
    let lastPointNumber = '';

    for(let path of paths){
      if(path.includes('.txt')){
          isTxt = true;
          txtPath = path;
      }else{
        let rawData = [];
        // -- Read raw points file
         let otherData = fs.readFileSync(path, 'utf-8').split(/\r?\n/).forEach(function(line){
           rawData.push(line);});
          files.push(rawData);
      }
    }

    if(isTxt){
      let txtFile=[]
      console.log('the path is: ' + txtPath);
      fs.readFileSync(txtPath, 'utf-8').split(/\r?\n/).forEach(function(line){
        txtFile.push(line);});
        console.log(txtFile);
        lastPointNumber = txtFile[txtFile.length-1].substring(txtFile[txtFile.length-1].lastIndexOf(',')+1);
   
        console.log('the last point is: ' + lastPointNumber);
    }

  
    let finalFiles = [];
    for(let i = 1; i< files.length; i++){
      files[0] = files[0].concat(files[i]);
      console.log(files);
    };


    const parser = new Parser(files[0],species,paths[0],parseInt(lastPointNumber));
    parser.generateFiles();
    filePaths = [];
  }