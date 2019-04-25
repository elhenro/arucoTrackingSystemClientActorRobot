var Gpio = require('onoff').Gpio;
var PWM = require('pigpio').Gpio;

var pin1 = new Gpio(14, 'out');
var pin2 = new Gpio(15, 'out');
var pin3 = new Gpio(18, 'out');
var pin4 = new Gpio(23, 'out');

var pwm1 = new PWM(13, {mode: Gpio.OUTPUT});
var pwm2 = new PWM(12, {mode: Gpio.OUTPUT});

pwm1.pwmFrequency(30)
pwm2.pwmFrequency(30)

exports.forward = function(speedr, speedl) {
  if (speedr == 1) {
    speedr = 255;
  }
  else {
    speedr = Math.round(Math.abs(speedr) * 255);
  }
  if (speedl == 1) {
    speedl = 255;
  } else {
    speedl = Math.round(Math.abs(speedl) * 255);
  }
  // console.log(speed);
  pwm1.pwmWrite(speedr);
  pwm2.pwmWrite(speedl);
  pin1.writeSync(1);
  pin2.writeSync(0);
  pin3.writeSync(0);
  pin4.writeSync(1);

}

exports.stop = function() {
  pin1.writeSync(0);
  pin2.writeSync(0);
  pin3.writeSync(0);
  pin4.writeSync(0);
}

exports.turnRight = function(speed) {
  // console.log(speed);
  if (speed === 1) {
    speed = 255;
  }
  else {
    speed = Math.round(Math.abs(speed) * 255);
  }

  pwm1.pwmWrite(speed);
  pwm2.pwmWrite(speed);
  pin1.writeSync(0);
  pin2.writeSync(1);
  pin3.writeSync(0);
  pin4.writeSync(1);

}

exports.turnLeft = function(speed) {
  if (speed == 1) {
    speed = 255;
  }
  else {
    speed = Math.round(Math.abs(speed) * 255);
  }
  pwm1.pwmWrite(speed);
  pwm2.pwmWrite(speed);
  pin1.writeSync(1);
  pin2.writeSync(0);
  pin3.writeSync(1);
  pin4.writeSync(0);

}
exports.back = function(speed) {
  if (speed == 1) {
    speed = 255;
  }
  else {
    speed = Math.round(Math.abs(speed) * 255);
  }
  pwm1.pwmWrite(speed);
  pwm2.pwmWrite(speed);
  pin1.writeSync(0);
  pin2.writeSync(1);
  pin3.writeSync(1);
  pin4.writeSync(0);

}
