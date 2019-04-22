# Raspberry-QIot-Indoor
#### Table of Contents

1. [Description](#description)
2. [Setup - The basics of getting start](#setup)
3. [Usage - Configuration options and additional functionality](#usage)

## Description

Connect Grove Indoor Environment Kit for Intel Edison & GrovePi+ & Raspberry Pi 3 QNAP NAS via QIoT Suite Lite.

## Setup

### Setup Requirements

* A GrovePi+ & Raspberry Pi 3 & SD card installed Raspbian OS
* Grove Indoor Environment Kit for Intel Edison
* 1 Micro B to Type A USB cables
* A USB power supply with 2100mA at least
* A Wifi AP


### Installation

1. Configure and test your device

    * Using 26AWG Grove Cable making the following connections:

      |    Grove Modules    | Connected to |
      | ---------- | --- |
      | Temperature & Humidity Sensor |  I2C |
      | Moisture Sensor | A1 |
      | Light Sensor | A2 |
      | PIR Motion Sensor | D3 |
      | Encoder | **\*Onbord PIN 11 (GPIO 17)** |
      | Button | D6 |
      | LCD RGB Backlight | I2C |
      | Relay | **\*Onbord PIN 18 (GPIO24)** |
      | Buzzer | D5 |
      
      \* Need to use **[Grove - 4 pin Female Jumper to Grove 4 pin Conversion Cable](https://www.seeedstudio.com/Grove-4-pin-Female-Jumper-to-Grove-4-pin-Conversion-Cable-5-PCs-per-PAck.html)** to connect to Raspberry Pi board (not GrovePi+'s Pin).

2. Upload all file on Raspberry Pi to this path : `/home/pi/`

3. Install Node.js on Raspberry Pi

4. Run `setup.sh` in `/home/pi/Rpi_side/` to install required libraries

## Usage
### Import sample application ([iot_inbox.json](/QIoT_side/iot_inbox.json)) in QIoT Suite Lite
* Import the `iot_inbox.json` file in the IoT Application Panel.
* Go to "Thing" panel and click "Connect a Device" in the action section.
* Choose MQTTS protocol
* Download certificates file
* Download resource info file

### Upload certificates and resourceinfo file to your Raspberry Pi
You can upload files to Raspberry Pi by Filezilla or WinSCP tools
* Upload certificates to /home/pi/Rpi_side/ssl
* Upload `resourceinfo.json` to /home/pi/Rpi_side/res

### Run sample code on Raspberry Pi and connect to QIoT Suite Lite
  ~~~
  cd /home/pi/Rpi_side/
  ~~~

  * Run sample code in foreground mode
  ~~~
  node boot.js
  ~~~
### Auto setup environment and auto start sample code on boot 
  ~~~
  bash setup_autostart.sh
  ~~~

  * Start service
  ~~~
  systemctl start iotkit.service
  ~~~
  * Stop service
  ~~~
  systemctl stop iotkit.service
  ~~~
  * Restart service
  ~~~
  systemctl restart iotkit.service
  ~~~
  * Status service
  ~~~
  systemctl status iotkit.service
  ~~~