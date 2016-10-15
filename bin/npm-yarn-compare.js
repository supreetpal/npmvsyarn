#!/usr/bin/env node

process.title = 'npm-yarn-compare';

let child_process = require('child_process'),
    prettyMs = require('pretty-ms'),
    clc = require('cli-color');

let packageName = process.argv[2];

console.log('🛀 Checking if yarn is installed...');
let cmdExist = child_process.execSync('hash yarn').toString().trim();

if (cmdExist !== '') {
    console.log('🤕 yarn command not found in a global scope.');
    console.log('😴 Installing yarn...');
    child_process.execSync('npm install -g yarn');
} else {
    console.log('👯 yarn exists in a global scope');
}

console.log('🛀 Adding ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
let timeStamp = Date.now();
child_process.execSync('yarn add ' + packageName + ' > /dev/null 2>&1');
let timeTaken = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to add ' + clc.red(prettyMs(timeTaken)) + '');

console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
timeStamp = Date.now();
child_process.execSync('yarn remove ' + packageName + ' > /dev/null 2>&1');
timeTaken = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to remove ' + clc.red(prettyMs(timeTaken)) + '');

timeStamp = Date.now();
console.log('🛀 Installing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
child_process.execSync('npm install ' + packageName + ' > /dev/null 2>&1');
timeTaken = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to install ' + clc.red(prettyMs(timeTaken)) + '');

console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
timeStamp = Date.now();
child_process.execSync('npm uninstall ' + packageName + ' > /dev/null 2>&1');
timeTaken = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to uninstall ' + clc.red(prettyMs(timeTaken)) + '');
