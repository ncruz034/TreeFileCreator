
const fs = require('fs');
const electron = require('electron')
const path = require('path')
const species = require('../assets/js/species.json');
//const Parser = require('./parser.js')

/*
class Parser {
  constructor(rawData, speciesJSON,filePath){
    this.filePath = filePath;
    this.rawData = rawData;
    this.speciesJSON = speciesJSON;
  }

  peek(items) { 
      return items[this.items.length - 1]; 
  } 

  isEmpty(items) { 
      return items.length == 0; 
  } 

  generateFiles(){
  let tempDataArr=[];
  let finalStack = []; //new Stack();

  // -- Load all the data into a stack to flip the original file top to bottom
  // -- so that parsing the file can be easely acomplished.
  let tempStack =[];// new Stack();
  for(let i = 0; i < this.rawData.length; i++){
    tempStack.push(this.rawData[i]);
  }

  // -- This is the first pass at cleanning the original file.
  while(!(tempStack.length == 0)){
    if(tempStack.pop().includes("--TREE")){
      tempStack.pop(); // -- Drops additional attribute.
      tempStack.pop(); // -- Drops additional attribute.
      for(let j = 0; j < 4; j++){
        if(tempStack[tempStack.length - 1].includes("FC,")){
          tempStack.pop(); //  -- Drops attribute containing name of tree
        }
        let value = tempStack.pop();
        if(value.includes("SP,")){
          tempDataArr.push(this.parseValue(value));
        }else{
          tempDataArr.push(value.substring(value.lastIndexOf("TV")+2));
        }
      }
    }
  }

  // -- Load the cleaner file into a stack to flip the data so that it comes out
  // -- in the correct order.
  for(let element of tempDataArr){
    finalStack.push(element)
  }

// -- Two files are necesary to accomplish the task, The first one will be
// -- loaded into CAD, and the second one will be used to create an Excell
// -- table. This code call functions that will clean the data and format
// -- the output accordingly.
let flatData = this.createFlatData(finalStack);
let fileForExcell = this.createFileForExcell(flatData);
let fileForCad = this.createCadFile(flatData);
this.writeFiles(fileForCad,fileForExcell);
}

fileForExcell(){
  return fileForExcell;
}

writeFiles(fileForCad,fileForExcell){
  // -- Writes the file to be loaded into CAD.
  let path = this.filePath.substring(0,this.filePath.length-4);
  let cadFile = fs.createWriteStream(`${path}-fileForCad.txt`);
  cadFile.on('error', function(err) { if(err) throw err; });
  fileForCad.forEach(function(v) { cadFile.write(v); });
  cadFile.end();

  // -- Writes the file to be used in Excell.
  let excelFile = fs.createWriteStream(`${path}-fileForExcell.txt`);
  excelFile.on('error', function(err) { if(err) throw err; });
  fileForExcell.forEach(function(v) { excelFile.write(v); });
  excelFile.end();
}


  // -- Formats all the information that will be used later to 
  // -- create the required files.
  createFlatData(stackValues){
    let finalArr = [];
    while(!(stackValues.length == 0)){
      finalArr.push(`${stackValues.pop()},${stackValues.pop()},${stackValues.pop()},${stackValues.pop()}\n`);
    }
    return finalArr;
  }

  // -- Format the individual strings and returns an array with the data
  // -- to be loaded in CAD.
  createCadFile(values){
    // format --> PN, N, E, El, TN
    let tempArr = [];
    let finalArr = [];
    for(let i = 0; i < values.length; i++){
      tempArr = values[i].split(',');
      finalArr.push(`${tempArr[0]},${tempArr[1]},${tempArr[2]},${tempArr[3]},${i+1}\n`)
    }
    return finalArr;
  }

  // -- Format the individual strings and returns an array with the data
  // -- to be loaded in Excell
  createFileForExcell(values){
    let tempArr = [];
    let finalArr = [];
    finalArr.push(`TREE No.,COMMON NAME,SPECIE,TRUNK,HEIGHT,CANOPY\n`);
    for(let i = 0; i < values.length; i++){
      tempArr = values[i].split(',');
      let specie = this.findSpecie(tempArr[4]);
      finalArr.push(`${i+1},${tempArr[4]},${specie},${tempArr[5]},${tempArr[6]},${tempArr[7]}`)
    }

    for(let i = 0; i < finalArr.length; i++){
    console.log(finalArr[i]);
    }
    return finalArr;
  }

  // -- Reads data from the species.json file to match the common and scientific name
 findSpecie(common){
    let theSpecie = "Unknown";
    this.speciesJSON.species.forEach(function(item){
        if(common === item.common){
          theSpecie = item.specie;
        }
    });
      return theSpecie;
  }

  // -- Cleans unnecesary characters from the original file
   parseValue(value){
    let tempValue = value.replace("SP,PN","");
    tempValue = tempValue.replace(",N ",",");
    tempValue = tempValue.replace(",E ",",");
    tempValue = tempValue.replace(",EL",",");
    tempValue = tempValue.replace(",--",",");
    return tempValue;
  }
}
*/

//=========================================================================================
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
    parser.generateFiles();

    return rawData;
  }


  