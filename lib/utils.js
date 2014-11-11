function consoleWriter(string){
  if(global.hackMode > 0){
    console.log(string);
  }
}

exports.consoleWriter = consoleWriter;