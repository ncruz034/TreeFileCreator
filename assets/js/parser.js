// -- Imports

export class Parser {

  constructor(){}

peek(items) { 
    return items[this.items.length - 1]; 
} 

isEmpty(items) { 
    return items.length == 0; 
} 


generateFiles(rawData, speciesJSON){
  this.speciesJSON = speciesJSON
//let rawData = [];
let tempDataArr=[];
let finalStack = new Stack();

// -- Load all the data into a stack to flip the original file top to bottom
// -- so that parsing the file can be easely acomplished.
let tempStack = new Stack();
for(i = 0; i < rawData.length; i++){
  tempStack.push(rawData[i]);
}

// -- This is the first pass at cleanning the original file.
while(!tempStack.isEmpty()){
  if(tempStack.pop().includes("--TREE")){
    tempStack.pop(); // -- Drops additional attribute.
    tempStack.pop(); // -- Drops additional attribute.
    for(j = 0; j < 4; j++){
      if(tempStack.peek().includes("FC,")){
        tempStack.pop(); //  -- Drops attribute containing name of tree
      }
      let value = tempStack.pop();
      if(value.includes("SP,")){
        tempDataArr.push(parseValue(value));
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
let flatData = createFlatData(finalStack);
let fileForExcell = createFileForExcell(flatData);
let fileForCad = createCadFile(flatData);

}
get fileForExcell(){
  return fileForExcell;
}
/*
=========================================================================================
*/
writeFiles(){
  // -- Writes the file to be loaded into CAD.
  let cadFile = fs.createWriteStream('fileForCad.txt');
  cadFile.on('error', function(err) { if(err) throw err; });
  fileForCad.forEach(function(v) { file.write(v); });
  cadFile.end();

  // -- Writes the file to be used in Excell.
  let excelFile = fs.createWriteStream('fileForExcell.csv');
  excelFile.on('error', function(err) { if(err) throw err; });
  fileForExcell.forEach(function(v) { file.write(v); });
  excelFile.end();
}


  // -- Formats all the information that will be used later to 
  // -- create the required files.
  createFlatData(stackValues){
    let finalArr = [];
    while(!stackValues.isEmpty()){
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
    for(i = 0; i < values.length; i++){
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
    for(i = 0; i < values.length; i++){
      tempArr = values[i].split(',');
      let specie = findSpecie(tempArr[4]);
      finalArr.push(`${i+1},${tempArr[4]},${specie},${tempArr[5]},${tempArr[6]},${tempArr[7]}`)
    }

    for(i = 0; i < finalArr.length; i++){
    console.log(finalArr[i]);
    }
    return finalArr;
  }

  // -- Reads data from the species.json file to match the common and scientific name
 findSpecie(common){
    let theSpecie = "Unknown";
    speciesJSON.species.forEach(function(item){
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