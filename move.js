var Gpio = require('onoff').Gpio;
var PWM = require('pigpio').Gpio;
const settings = require('./settings');

var pin1 = new Gpio(14, 'out');
var pin2 = new Gpio(15, 'out');
var pin3 = new Gpio(18, 'out');
var pin4 = new Gpio(23, 'out');

var pwm1 = new PWM(13, {mode: Gpio.OUTPUT});
var pwm2 = new PWM(12, {mode: Gpio.OUTPUT});

pwm1.pwmFrequency(settings.frequency)
pwm2.pwmFrequency(settings.frequency)

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
  pin1.writeSync(settings.forward.pin1);
  pin2.writeSync(settings.forward.pin2);
  pin3.writeSync(settings.forward.pin3);
  pin4.writeSync(settings.forward.pin4);

}

exports.stop = function() {
  pin1.writeSync(0);
  pin2.writeSync(0);
  pin3.writeSync(0);
  pin4.writeSync(0);
}

exports.turnRight = function(speedr, speedl) {
  if (speedr == 1) {
    speedr = 255;
  } else {
    speedr = Math.round(Math.abs(speedr) * 255);
  }
  if (speedl == 1) {
    speedl = 255;
  } else {
    speedl = Math.round(Math.abs(speedl) * 255);
  }

  pwm1.pwmWrite(speedr);
  pwm2.pwmWrite(speedl);
  pin1.writeSync(settings.right.pin1);
  pin2.writeSync(settings.right.pin2);
  pin3.writeSync(settings.right.pin3);
  pin4.writeSync(settings.right.pin4);

}

exports.turnLeft = function(speedr, speedl) {
  if (speedr == 1) {
    speedr = 255;
  } else {
    speedr = Math.round(Math.abs(speedr) * 255);
  }
  if (speedl == 1) {
    speedl = 255;
  } else {
    speedl = Math.round(Math.abs(speedl) * 255);
  }
  pwm1.pwmWrite(speedr);
  pwm2.pwmWrite(speedl);
  pin1.writeSync(settings.left.pin1);
  pin2.writeSync(settings.left.pin2);
  pin3.writeSync(settings.left.pin3);
  pin4.writeSync(settings.left.pin4);

}
exports.back = function(speedr, speedl) {
  if (speedr == 1) {
    speedr = 255;
  } else {
    speedr = Math.round(Math.abs(speedr) * 255);
  }
  if (speedl == 1) {
    speedl = 255;
  } else {
    speedl = Math.round(Math.abs(speedl) * 255);
  }
  pwm1.pwmWrite(speedr);
  pwm2.pwmWrite(speedl);
  pin1.writeSync(settings.back.pin1);
  pin2.writeSync(settings.back.pin2);
  pin3.writeSync(settings.back.pin3);
  pin4.writeSync(settings.back.pin4);

}
