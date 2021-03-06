var childProcess = require('child_process');
var connection = childProcess.fork('./connection.js');

var os = require('os');
var util = require('util');
var qiot = require('./lib/qiot');
var networkInterfaces = os.networkInterfaces();

/**
 * Import sensors function
 */

var sensorButton = require('./sensors/button.js');
var button = new sensorButton();

var sensorLight = require('./sensors/light.js');
var light = new sensorLight();

var sensorMoisture = require('./sensors/moisture.js');
var moisture = new sensorMoisture();

var sensorPIR = require('./sensors/pir_motion.js');
var pir = new sensorPIR();

var sensorRelay = require('./sensors/relay.js');
var relay = new sensorRelay();

var sensorEncoder = require('./sensors/rotary_encoder.js');
var encoder = new sensorEncoder();

var sensorTH02 = require('./sensors/th02.js');
var th02 = new sensorTH02();

var sensorBuzzer = require('./sensors/buzzer.js');
var buzzer = new sensorBuzzer();

var sensorLcd = require('./sensors/rgb_lcd.js');
var lcd = new sensorLcd();


/**
 * Show IP address in LCD
 */

function showIP() {
    try {
        for (var inter in networkInterfaces) {
            if (inter != 'lo'){
                for (var count in networkInterfaces[inter]){
                    if (networkInterfaces[inter][count].address != 'undefined'){
                        lcd.write(util.format('IP:%s', networkInterfaces[inter][count].address),1,0);
                        lcd.write(LCDUpLastValue, 0, 0);
                        break;
                    }
                }
                break;
            }
            else{
                lcd.write("NO ANY IP!!",1,0);
                lcd.write(LCDUpLastValue, 0, 0);
            }
        }
    } catch (error) {
        lcd.write("NO IP!!",1,0);
        lcd.write(LCDUpLastValue, 0, 0);
    }
    
}

/**
 * Show sensor message on LCD
 */

var encoderPos = 0;
var th02Value;
var moistureValue = 0;
var lightValue;
var uvValue;
var pirValue;
var LCDUpLastValue = "";

function showLCD() {
    switch (encoderPos) {
        case 0:
            lcd.write(util.format('motion:%s', pirValue),1,0);
            lcd.write(LCDUpLastValue, 0, 0);
            break;
        case 1:
            lcd.write(util.format('light:%s lux', lightValue),1,0);
            lcd.write(LCDUpLastValue, 0, 0);
            break;
        case 2:
            if (typeof moistureValue !== 'undefined') {
                lcd.write(util.format('mositure:%s', moistureValue.value),1,0);
                lcd.write(LCDUpLastValue, 0, 0);
            }
            break;
        case 3:
            if (typeof th02Value !== 'undefined') {
                lcd.write(util.format('temp:%s hum:%s',
                        th02Value.temperature, th02Value.humidity),1,0);
                lcd.write(LCDUpLastValue, 0, 0);
            }
            break;
        case 4:
            showIP();
            break;
        default:
            break;
    }
}

/**
 * Receive data from QIoT Suite Lite.
 */
connection.on('message', function(data) {
    switch (data.id) {
        case 'relay':
            console.log('relay: %s', data.message.value);
            console.log('------------------------');
            relay.relayCtrl(data.message.value);
            break;
        case 'buzzer':
            console.log('buzzer: %s', data.message.value);
            console.log('------------------------');
            var dataJson = JSON.parse(data.message.value);
            switch (dataJson.command) {
                case 'setVolume':
                    buzzer.setVolume(dataJson.volume);
                    console.log('volume: %d', dataJson.volume);
                    break;
                case 'playSound':
                    buzzer.playSound(dataJson.tone, dataJson.delay);
                    break;
                case 'stopSound':
                    buzzer.stopSound();
                    console.log("STOP!!!!!!!");
                    break;
                default:
                    break;
            }
            break;
        /***************************/
        case 'lcd':
            lcd.write(data.message,0,0);
            LCDUpLastValue = data.message;
            break;
        case 'showIP':
            showIP();
            break;
        /***************************/
        case 'ERROR':
            lcd.write(data.message,0,0);
            LCDUpLastValue = data.message;
            break;
        default:
            break;
    }
});


/**
 * Receive sensor data.
 */
/***************************/
pir.on('message', function(data) {
    connection.send({id: 'motion', value: data});
    pirValue = data;
    showLCD();
});

light.on('message', function(data) {
    connection.send({id: 'light', value: data});
    lightValue = data;
    showLCD();
});

moisture.on('message', function(value, level) {
    var data = { value: value, level: level };
    connection.send({id: 'moisture', value: data.value});
    moistureValue = data;
    showLCD();
});

button.on('message', function(data) {
    connection.send({id: 'button', value: data});
    showLCD();
});

encoder.on('message', function(data) {
    connection.send({id: 'encoder', value: data});
    encoderPos = data % 5;
    if (encoderPos < 0) {
        encoderPos *= -1;
    }
    showLCD();
});

th02.on('message', function(tempValue, humValue) {
    var data = { temperature: tempValue, humidity: humValue };
    connection.send({id: 'temp', value: data.temperature});
    connection.send({id: 'hum', value: data.humidity});
    th02Value = data;
    showLCD();
});

/***************************/

lcd.write('Connecting......',0,0);

process.on('SIGINT', function() {
    console.log('Exiting........');
    connection.kill();
    process.exit(0);
});

process.on('uncaughtException', function(err) {
    console.log('err :' + err);
    lcd.write(util.format('Something ERR'),0,0);
    lcd.write(util.format('Restarting.....'),1,0);
    connection.kill();
    process.exit(0);
});