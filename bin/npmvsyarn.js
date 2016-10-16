#!/usr/bin/env node

process.title = 'npmvsyarn';

let prettyMs = require('pretty-ms'),
    clc = require('cli-color'),
    sh = require('shelljs');

let packageName = process.argv[2];

//Check if yarn exists, if not install it
console.log('🕵 Checking if ' + clc.blue('yarn') + ' is installed...');

if (!sh.which('yarn')) {
    console.log('🤕 ' + clc.blue('yarn') + ' command not found in a global scope.');
    console.log('😴 Installing ' + clc.blue('yarn') + '...');
    sh.exec('npm install -g yarn', {silent:true});
} else {
    console.log('👯 ' + clc.blue('yarn') + ' exists in a global scope');
}

//Install module using yarn add
console.log('🛀 Adding ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
let timeStamp = Date.now();
sh.exec('yarn add ' + packageName, {silent:true});
let yarnAddTime = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to add ' + clc.red(prettyMs(yarnAddTime)) + '');

//Uninstall module using yarn remove
console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
timeStamp = Date.now();
sh.exec('yarn remove ' + packageName, {silent:true});
let yarnRemoveTime = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to remove ' + clc.red(prettyMs(yarnRemoveTime)) + '');

//Install module using npm install
timeStamp = Date.now();
console.log('🛀 Installing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
sh.exec('npm install ' + packageName, {silent:true});
let npmAddTime = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to install ' + clc.red(prettyMs(npmAddTime)) + '');

//Uninstall module using npm uninstall
console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
timeStamp = Date.now();
sh.exec('npm uninstall ' + packageName, {silent:true});
let npmRemoveTime = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to uninstall ' + clc.red(prettyMs(npmRemoveTime)) + '');
