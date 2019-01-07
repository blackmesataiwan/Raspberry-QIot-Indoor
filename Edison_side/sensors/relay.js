var pin = 18
var gpio = require('rpi-gpio')
var gpiop = gpio.promise;

var sensorRelay = function () {
    this.relayCtrl = relayCtrl;
}

function relayCtrl(value){
    switch (value) {
        case 'on':
        case 1:
            gpiop.setup(pin, gpio.DIR_OUT)
                .then(() => {
                    console.log('%s is on', "Relay");
                    return gpiop.write(pin, true)
                })
                .catch((err) => {
                    console.log('Relay Error: ', err.toString())
                })
            break;
        case 'off':
        case 0:
            gpiop.setup(pin, gpio.DIR_OUT)
                .then(() => {
                    console.log('%s is off', "Relay");
                    return gpiop.write(pin, false)
                })
                .catch((err) => {
                    console.log('Relay Error: ', err.toString())
                })
            break;
        default:
            break;
    }
}

module.exports = sensorRelay;