class Parser {
    constructor(rawData, speciesJSON,filePath,lastPointNumber){
      this.filePath = filePath;
      this.rawData = rawData;
      this.speciesJSON = speciesJSON;
      this.lastPointNumber = lastPointNumber;
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
      // -- This is the first pass at cleanning the original file.
      while(!(this.rawData.length == 0)){
        if(this.rawData.pop().includes("--TREE")){
          this.rawData.pop(); // -- Drops additional attribute.
          this.rawData.pop(); // -- Drops additional attribute.
          for(let j = 0; j < 4; j++){
            if(this.rawData[this.rawData.length - 1].includes("FC,")){
              this.rawData.pop(); //  -- Drops attribute containing name of tree
            }
            let value = this.rawData.pop();
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
  // -- After creating the flatData file it is used to create two other files;
  // -- they get loaded into CAD, and the second one will be used to create an Excell
  let flatData = this.createFlatData(finalStack);
  let files=[];
  files = this.createFiles(flatData);
  this.writeFiles(files);
  }
  fileForExcell(){
    return fileForExcell;
  }
  //  =========================================================================================
  writeFiles(theFiles){
    let extensions = ['.csv','.txt'];
    for(let i = 0; i < theFiles.length; i++){
      // -- Writes the file to be loaded into CAD.
      let path = this.filePath.substring(0,this.filePath.length-4);
      let finalFile = fs.createWriteStream(`${path}Trees${extensions[i]}`);
      finalFile.on('error', function(err) { if(err) throw err; });
      theFiles[i].forEach(function(v) { finalFile.write(v); });
      finalFile.end();
    }
  }
    // -- Formats all the information that will be used later to create the required files.
    createFlatData(stackValues){
      let finalArr = [];
      while(!(stackValues.length == 0)){
        finalArr.push(`${stackValues.pop()},${stackValues.pop()},${stackValues.pop()},${stackValues.pop()}\n`);
      }
      return finalArr;
    }
    // -- Create final files (one .txt file for CAD, and one .csv file for excel);
    createFiles(values){
      let tempArr = [];
      let exlArr = [];
      let cadArr = [];
      exlArr.push(`TREE No.,COMMON,SPECIE,DIA.,HT.,CNPY.\n,NAME, ,IN.,FT.,FT\n`);

      for(let i = 0; i < values.length; i++){
        tempArr = values[i].split(',');
        exlArr.push(`${this.lastPointNumber + i+1},${tempArr[4]},${this.findSpecie(tempArr[4])},${tempArr[5]},${tempArr[6]},${tempArr[7]}`);
        cadArr.push(`${tempArr[0]},${tempArr[1]},${tempArr[2]},${tempArr[3]},${this.lastPointNumber + i+1}\n`)
    }
    // -- Clear the \n (new line) from the last array element.
    cadArr[cadArr.length-1] = cadArr[cadArr.length-1].substring(0,cadArr[cadArr.length-1].length-1)
    return [exlArr,cadArr];
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
    // -- Cleans unnecesary characters from the original .RAW file
     parseValue(value){
      let tempValue = value.replace("SP,PN","");
      tempValue = tempValue.replace(",N ",",");
      tempValue = tempValue.replace(",E ",",");
      tempValue = tempValue.replace(",EL",",");
      tempValue = tempValue.replace(",--",",");
      return tempValue;
    }
  }