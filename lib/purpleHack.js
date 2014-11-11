var Promise = require("bluebird"),
    chalk = require("chalk"),
    request = Promise.promisify(require("request")),
    _ = require('underscore'),

    consoleWriter = require("./utils").consoleWriter,

    letterMap = require('./letterMap'),
    purpleUrls = {
      challenge: 'http://iampurpleenough.cloud-nexus.se:4434/challenge',
      suffix: 'http://iampurpleenough.cloud-nexus.se:4434/suffix'
    };

function getPrefix(){
  var resolver = Promise.pending();

  consoleWriter(chalk.red("\nHacking Prefix.. (" + purpleUrls.challenge + ")"));

  request(purpleUrls.challenge)
    .then(function(response){
      var challengeJSON = JSON.parse(response[1]);

      Promise.map(challengeJSON, function(letterObject) {
        return letterMap.getLetterFromValue(letterObject.value)
      }).then(function(prefixMap){
        var prefixAsString = prefixMap.join('');
        
        consoleWriter(chalk.red("Got " + prefixAsString + "..."));
        resolver.resolve(prefixAsString);

      });
  });

  return resolver.promise;
}

function getSuffix(){
  var resolver = Promise.pending();

  consoleWriter(chalk.red("Hacking Suffix..  (" + purpleUrls.suffix + ")"));

  request(purpleUrls.suffix)
    .then(function(response){
      var suffixJSON = JSON.parse(response[1]);

      consoleWriter(chalk.red("Got " + suffixJSON.emailSuffix + "..."));
      resolver.resolve(suffixJSON.emailSuffix);

    });

  return resolver.promise;
}

function getChallengeEmail(isHackMode){
  var resolver = Promise.pending(),
      isHackMode = isHackMode;

  Promise.all([getPrefix(), getSuffix()]).spread(function(prefix, suffix){
    consoleWriter(chalk.red("Combining prefix and suffix.."));
    resolver.resolve(prefix + suffix);
  });

  return resolver.promise;
}


exports.getChallengeEmail = getChallengeEmail;