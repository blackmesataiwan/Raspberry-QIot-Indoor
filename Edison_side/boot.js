/**
 *   This sample code demonstrate indoor environment kit connected to QIoT
 *   Suite Lite by MQTTS protocol
 *   requirement:
 *   -- npm install
 *   run command: node boot.js
 */

var childProcess = require('child_process');
var util = require('util');
var os = require('os');
var readline = require('readline');
var sleep = require('sleep');

var sensorLcd = require('./sensors/rgb_lcd.js');
var lcd = new sensorLcd();

var sensorButton = require('./sensors/button.js');
var button = new sensorButton();

var networkInterfaces = os.networkInterfaces();
var ctrl;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showLCDInfo(word) {
    lcd.write(word, 0, 0);
}

var infomation = setInterval(function() {
    showLCDInfo('Please input ');
    sleep.sleep(1);
    showLCDInfo('resource file');
    sleep.sleep(1);
    showLCDInfo('before');
    sleep.sleep(1);
    showLCDInfo('clicking button!!!!');
}, 500);

lcd.write("Input res file!!", 0, 0);

try {
    for (var inter in networkInterfaces) {
        if (inter != 'lo'){
            for (var count in networkInterfaces[inter]){
                if (networkInterfaces[inter][count].address != 'undefined'){
                    lcd.write(util.format('IP:%s', networkInterfaces[inter][count].address), 1, 0);
                    break;
                }
            }
            break;
        }
        else{
            lcd.write("NO ANY IP!!", 1, 0);
        }
    }
} catch (error) {
    lcd.write("NO ANY IP!!", 1, 0);
}

rl.question('Please input resource file before clicking button!', function(answer) {
    // rl.close();
});

rl.on('close', function() {
    console.log('Exiting........');
    try {
        ctrl.kill('SIGINT');
    } catch (error) {
        console.log("");
    }
    
    //process.exit(0);
});

button.on('message', function(data) {
    if (data) {
        clearInterval(infomation);
        clearInterval(button.myInterval);
        console.log('Starting........');
        showLCDInfo('Starting........');
        ctrl = childProcess.fork('./ctrl.js');
        ctrl.on('close', function(err) {
            console.log('ctrl_err : ' + err);
            ctrl.kill('SIGINT');
            process.exit(0);
        });
    }
});

process.on('SIGINT', function() {
    console.log('Exiting........');
    ctrl.kill('SIGINT');
    process.exit(0);
});
    