#!/usr/bin/env node
"use strict";
var Promise = require("bluebird"),
    inquirer = require("inquirer"),
    chalk = require("chalk"),
    request = Promise.promisify(require("request")),
    _ = require('underscore'),
    getChallengeEmail = require("./lib/purpleHack").getChallengeEmail,
    scout = '                          `:oo+oo+.               \n ' +
            '                         :s/`    .oo`             \n ' +
            '                        oo`        :y`            \n ' +
            '                       oo           s/            \n ' +
            '                 `..-.:h`           s/            \n ' +
            '            `-/+++/:::oy`          .h.            \n ' +
            '       `./+++:.`.`    .h/          o+             \n ' +
            '    ./oo/-``    o/     sh/`       :y`             \n ' +
            ' `/o+:++++:-`   o+     -h/s:`    :h/`             \n ' +
            '`s/`    `.-:++++y.     `h-`:o+:/s+-/s:            \n ' +
            '/s           `.-+++-`   /s  `:ho.   +o            \n ' +
            '-y:`             `.ss/` .d``/s- `.  s/            \n ' +
            ' ./s+/:--..````...-h.:o/`h/s/` `s/  s+            \n ' +
            ' -+o-.--::/oyo+//:+s/ `:ohy-   +o   :y`           \n ' +
            '/s-       :s:`     `s/  `+s.  :y`   `y-           \n ' +
            'h-      `+s.        -y    /s-/s.     /y`          \n ' +
            's+     `oo`         -h.    so---     `y-          \n ' +
            '.h`   `oo`          /ys:   so-/h.     /s`         \n ' +
            ' y:   +o`   .-::/:-.y/.s/.`y/::+s`    `ys+:.      \n ' +
            ' o+  +d/   :y/-..-:+h` `:/oh-  `y:     .h-:o+`    \n ' +
            ' /s`/soo   .h`     s+     `-`   -y.     /y` +s    \n ' +
            ' `yoo`-h`  `h:    .d`           `+s     `s/ `h.   \n ' +
            '  .-   o+  :ho    -y:/:----://+++`s+     -y`.h.   \n ' +
            '       `o++sos    /y`.-::::-.``   `y:   `.yos:    \n ' +
            '         `` /y    +s   /so+//:..`  -y--+o+/h:     \n ' +
            '            /y    s/   `-so..-:+o+:.:ysd.  -y.    \n ' +
            '            /s   `hs.     /s`    `-:/--h    -y-   \n ' +
            '            +o   -y:s+.`  -h.         -h     .y/  \n ' +
            '            o+   .h` -+o++o-           s+`+++:.s+`\n ' +
            '            s/    s/                   :hs+ `/s/so\n ' +
            '            y:    /y                   .:.    `:/.\n ' +
            '            y:   .y:                              \n ' +
            '            -ooooo.  \n\n';

var letsHack = {
  question: chalk.green("Lets hack!"),
  answers: [new inquirer.Separator(),
    'simple mode',
    'hack mode',
    'l33t mode (will send email to PurpleScout challenge mail)'
  ]
};

inquirer.prompt([
  {
    type: "list", 
    name: "hackMode",
    message: chalk.cyan(scout) + letsHack.question,
    choices: letsHack.answers,
    filter: function( val ) { 
      return letsHack.answers.indexOf(val)-1;
    }
  }
], function(listSelection){
  global.hackMode = listSelection.hackMode;

  getChallengeEmail().then(function(purpleEmail){
    console.log('Ooh yeay, got ' + chalk.green(purpleEmail));

    if (listSelection.hackMode > 1) {
      inquirer.prompt([{
          type: "input", 
          name: "name",
          message: 'Whats your name?'
        },{
          type: "input", 
          name: "resume",
          message: 'Where is your resume located?'
        },{
          type: "input", 
          name: "user",
          message: 'Email (gmail only supported)',
          validate: function(input) {
            if (input.indexOf('@gmail.com') < 0) return 'gmail.com accounts only supported';
            return true;
          }
        },{
          type: "password", 
          name: "password",
          message: 'Password'
        }], function(userInfo) {
          var nodemailer = require('nodemailer'),
              transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: userInfo.user,
                  pass: userInfo.password
              }
          });

          var messageString =  'Name: ' + userInfo.name + '\nCode: github.com/reimertz/purplehack' + '\nResume: ' + userInfo.resume;

          inquirer.prompt([{
            type: "list", 
            name: "sendEmail",
            message: 'Do you want to sent\n\n' + messageString + '\n\n to ' + purpleEmail  + ' from ' + userInfo.user + '?',
            choices: [new inquirer.Separator(),
              'Yes',
              'No'
            ],
            filter: function( val ) { 
              return letsHack.answers.indexOf(val)-1;
            }
          }], function(answer) {          
            if(!!answer.sendEmail){
              transporter.sendMail({
                  from: userInfo.user,
                  to: purpleEmail,
                  subject: 'challenge answer sent with challenge(Say whaaaaat?)',
                  text: messageString
              }, function(error, info){
                if(error){
                    console.log(error);
                } else {
                    console.log('Message sent!');
                }
                
                process.exit();
            });

            } else {
              console.log(chalk.red('Aborted'));
              process.exit();
            }
            
          }
        )
      })
    }
  })
});
      