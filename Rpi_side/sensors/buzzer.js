const mraa = require('mraa');
mraa.addSubplatform(mraa.GROVEPI, "0");

//var upmBuzzer = require('jsupm_buzzer');

/**
 * Create the buzzer object using GPIO pin 5
 */

var sensorBuzzer = function () {
    this.myBuzzer = new mraa.Gpio(512 + 5);
    /*
    this.chords = [upmBuzzer.BUZZER_DO, upmBuzzer.BUZZER_RE, upmBuzzer.BUZZER_MI,
    upmBuzzer.BUZZER_FA, upmBuzzer.BUZZER_SOL, upmBuzzer.BUZZER_LA,
    upmBuzzer.BUZZER_SI];
    */
    //this.myBuzzer.stopSound();
    this.myBuzzer.write(0);
    this.setVolume = setVolume;
    this.playSound = playSound;
    this.stopSound = stopSound;
}

function setVolume(value){
    value = (typeof value !== 'undefined') ?  value: 0;
    //this.myBuzzer.setVolume(value);
    console.log('volume: %d', value);
}

function playSound(tone, delay){
    var delay = function (s) {
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, s);
        });
    };
    tone = (typeof tone !== 'undefined') ?  tone: 0;
    delay = (typeof delay !== 'undefined') ?  delay: 0.5;
    //this.myBuzzer.playSound(this.chords[tone], delay);
    delay().then(function () {
        console.log(1);
        this.myBuzzer = new mraa.Gpio(512 + 5);
        this.myBuzzer.write(1);
        return delay(300)
    }).then(function () {
        console.log(0);
        this.myBuzzer.write(0);
    }).catch((err) => {
        console.log('Error: ', err.toString())
    });
}

function stopSound(){
    //this.myBuzzer.stopSound();
    this.myBuzzer.write(0);
}

module.exports = sensorBuzzer;