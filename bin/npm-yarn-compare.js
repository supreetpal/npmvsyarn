#!/usr/bin/env node

process.title = 'npm-yarn-compare';

let prettyMs = require('pretty-ms'),
    clc = require('cli-color'),
    sh = require('shelljs');

let packageName = process.argv[2];

console.log('🛀 Checking if yarn is installed...');
let cmdExist = sh.exec('hash yarn', {silent:true}).output;

if (cmdExist !== '') {
    console.log('🤕 yarn command not found in a global scope.');
    console.log('😴 Installing yarn...');
    sh.exec('npm install -g yarn', {silent:true});
} else {
    console.log('👯 yarn exists in a global scope');
}

console.log('🛀 Adding ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
let timeStamp = Date.now();
sh.exec('yarn add ' + packageName, {silent:true});
let yarnAddTime = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to add ' + clc.red(prettyMs(yarnAddTime)) + '');

console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('yarn'));
timeStamp = Date.now();
sh.exec('yarn remove ' + packageName, {silent:true});
let yarnRemoveTime = Date.now() - timeStamp;
console.log('🚀 Time taken by yarn to remove ' + clc.red(prettyMs(yarnRemoveTime)) + '');

timeStamp = Date.now();
console.log('🛀 Installing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
sh.exec('npm install ' + packageName, {silent:true});
let npmAddTime = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to install ' + clc.red(prettyMs(npmAddTime)) + '');

console.log('🛀 Removing ' + clc.green(packageName) + ' with ' + clc.blue('npm'));
timeStamp = Date.now();
sh.exec('npm uninstall ' + packageName, {silent:true});
let npmRemoveTime = Date.now() - timeStamp;
console.log('🚀 Time taken by npm to uninstall ' + clc.red(prettyMs(npmRemoveTime)) + '');
