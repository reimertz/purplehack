var Promise = require("bluebird"),
    chalk = require("chalk"),
    _ = require("underscore");

var letterMap = [{ 
  value: 0.11,
  letter: 'a'
},{ 
  value: 1.67,
  letter: 'b'
},{ 
  value: 2,
  letter: 'c'
},{ 
  value: 0.3,
  letter: 'd'
},{ 
  value: 2.44,
  letter: 'e'
},{ 
  value: 5,
  letter: 'f'
},{ 
  value: 1.65,
  letter: 'g'
},{ 
  value: 7,
  letter: 'h'
},{ 
  value: 0.18,
  letter: 'i'
},{ 
  value: 3.19,
  letter: 'j'
},{ 
  value: 0.10,
  letter: 'k'
},{ 
  value: 3.11,
  letter: 'l'
},{ 
  value: 5.12,
  letter: 'm'
},{ 
  value: 4.13,
  letter: 'n'
},{ 
  value: 0.114,
  letter: 'o'
},{ 
  value: 6.15,
  letter: 'p'
},{ 
  value: 2.16,
  letter: 'q'
},{ 
  value: 3.17,
  letter: 'r'
},{ 
  value: 9.184,
  letter: 's'
},{ 
  value: 19,
  letter: 't'
},{ 
  value: 2.01,
  letter: 'u'
},{ 
  value: 5.201,
  letter: 'v'
},{ 
  value: 32.2,
  letter: 'w'
},{ 
  value: 23,
  letter: 'x'
},{ 
  value: 0.24,
  letter: 'y'
},{ 
  value: 5.25,
  letter: 'z'
}];

function getLetterFromValue(value, isHackMode){
  var resolver = Promise.pending();

  if(!_.isNumber(value)){
    throw new Error('Error: ' + value + ' is not a number!');
  }
  letterMap.forEach(function(letterObject){

    if(letterObject.value == value){
        if (global.hackMode > 0) {
          console.log(chalk.red('Mapped ' + value + ' to ' + letterObject.letter + '  '));
        };
      return resolver.resolve(letterObject.letter);
    };
  });
  return resolver.promise;
}

exports.letterMap = letterMap;
exports.getLetterFromValue =  getLetterFromValue;