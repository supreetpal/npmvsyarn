#!/usr/bin/env node
'use strict';

process.title = 'npmvsyarn';

let prettyMs = require('pretty-ms'),
    clc = require('cli-color'),
    sh = require('shelljs'),
    Table = require('cli-table2');

let packageName = process.argv[2];

// Move existing node_modules (if any) to temp
console.log('🛀 Saving node_modules (if any) to temp');
if (sh.test('-d', 'node_modules')) {
    sh.mv('node_modules', 'temp_npmvsyarn_node_modules');
}

// Check if yarn exists, if not install it.
console.log('🕵 Checking if ' + clc.blue('yarn') + ' is installed...');

if (!sh.which('yarn')) {
    console.log('🤕 ' + clc.blue('yarn') + ' command not found in a global scope.');
    console.log('😴 Installing ' + clc.blue('yarn') + '...');
    sh.exec('npm install -g yarn', { silent: true });
} else {
    console.log('👯 ' + clc.blue('yarn') + ' exists in a global scope');
}

// Declare common variables
let timeStamp,
    yarnAddTime,
    npmAddTime,
    yarnRemoveTime,
    npmRemoveTime;

// Check if package name is provided
if (!packageName) {

    console.log('🛀 Running benchmark for current project');

    // Check if package.json exists
    if (!sh.test('-f', 'package.json')) {
        console.log('🤕 package.json does not exist');
        console.log('🚫 Exit');
        process.exit(1);
    }

    // Install module using yarn add.
    console.log('🛀 Installing with ' + clc.blue('yarn'));
    timeStamp = Date.now();
    sh.exec('yarn ', { silent: true });
    yarnAddTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by yarn to add ' + clc.green(prettyMs(yarnAddTime)) + '');

    // Clear node_modules
    sh.rm('-rf', 'node_modules');

    // Install module using npm install.
    timeStamp = Date.now();
    console.log('🛀 Installing with ' + clc.blue('npm'));
    sh.exec('npm install ', { silent: true });
    npmAddTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by npm to install ' + clc.green(prettyMs(npmAddTime)) + '');

} else {

    // Install module using yarn add.
    console.log('🛀 Adding ' + clc.magenta(packageName) + ' with ' + clc.blue('yarn'));
    timeStamp = Date.now();
    sh.exec('yarn add ' + packageName, { silent: true });
    yarnAddTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by yarn to add ' + clc.green(prettyMs(yarnAddTime)) + '');

    // Uninstall module using yarn remove.
    console.log('🛀 Removing ' + clc.magenta(packageName) + ' with ' + clc.blue('yarn'));
    timeStamp = Date.now();
    sh.exec('yarn remove ' + packageName, { silent: true });
    yarnRemoveTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by yarn to remove ' + clc.red(prettyMs(yarnRemoveTime)) + '');
    sh.rm('-rf', 'node_modules');



    // Install module using npm install.
    timeStamp = Date.now();
    console.log('🛀 Installing ' + clc.magenta(packageName) + ' with ' + clc.blue('npm'));
    sh.exec('npm install ' + packageName, { silent: true });
    npmAddTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by npm to install ' + clc.green(prettyMs(npmAddTime)) + '');

    // Uninstall module using npm uninstall.
    console.log('🛀 Removing ' + clc.magenta(packageName) + ' with ' + clc.blue('npm'));
    timeStamp = Date.now();
    sh.exec('npm uninstall ' + packageName, { silent: true });
    npmRemoveTime = Date.now() - timeStamp;
    console.log('🚀 Time taken by npm to uninstall ' + clc.red(prettyMs(npmRemoveTime)) + '');
}

// Display results in a table.
var table = new Table({
    head: ['Package Manager', 'npm', 'yarn'],
    colWidths: [20, 10, 10],
    style: {
        head: ['yellow']
    }
});

console.log('🛀 Cleaning up');
sh.rm('-rf', 'node_modules');
if (sh.test('-d', 'temp_npmvsyarn_node_modules')) {
    sh.mv('temp_npmvsyarn_node_modules', 'node_modules');
}

table.push(
    ['Install', prettyMs(npmAddTime), prettyMs(yarnAddTime)]
);

if (npmRemoveTime) {
    table.push(
        ['Uninstall', prettyMs(npmRemoveTime), prettyMs(yarnRemoveTime)]
    );
}

console.log(table.toString());
