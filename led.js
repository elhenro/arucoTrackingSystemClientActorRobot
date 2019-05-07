var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var net = require('net');
var ora = require('ora');
var spinners = require('cli-spinners');
var move = require('./move');
const settings = require('./settings');

var roboID = 10;


const spinner1 = ora({
  text: ' moving forward',
  spinner: spinners.arrow3,
  color: 'blue'
});
// rechts
const spinner2 = ora({
  text: ' turning right',
  spinner: spinners.arrow,
  color: 'blue'
});

const spinner3 = ora({
  text: ' turning left',
  spinner: {
  		"interval": 100,
  		"frames": [
  			"←",
  			"↙",
  			"↓",
  			"↘",
  			"→",
  			"↗",
  			"↑",
  			"↖"
  		]
  	},
  color: 'blue'
})




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





var client = new net.Socket();
client.connect(5000, '172.20.10.5', function() {
	console.log('Connected');

  // client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log(data.toString());
  if (data == 'go') {
    move.stop();
    move.forward(settings.moveSpeed);
    // console.log(true);
  }
  else if (data == 'back') {
    move.stop();
    move.back(settings.moveSpeed);
  }
  else if (data = 'stop') {
    move.stop();
  }
  else if (data = 'slow') {
    move.stop();
    move.slow(1);
  }
  else if (data = 'left') {
    move.stop();
    move.turnLeft(settings.turnSpeed);
  }
  else if (data = 'right') {
    move.stop();
    move.turnrRight(settings.turnSpeed);
  }
  else {
    move.stop();
  }
	// client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');

});

client.on('error', function(err) {
   console.log(err)
})

var stdin = process.openStdin();
stdin.addListener("data", function(d) {

  switch (d.toString().trim()) {
    case 'go':
      move.stop();
      move.forward(settings.moveSpeed);
      //console.log('\033[2J');
      //console.log('⏫');
      if (spinner1.isSpinning) {
        spinner1.succeed('next');
      }
      if (spinner2.isSpinning) {
        spinner2.succeed('next');
      }
      if (spinner3.isSpinning) {
        spinner3.succeed('next');
      }
      spinner1.start();
      break;
    case 'back':
      move.stop();
      move.back(settings.moveSpeed);
      //console.log('\033[2J');
      //console.log('⏫');
      if (spinner1.isSpinning) {
        spinner1.succeed('next');
      }
      if (spinner2.isSpinning) {
        spinner2.succeed('next');
      }
      if (spinner3.isSpinning) {
        spinner3.succeed('next');
      }
      spinner1.start();
      break;
    case 'stop':
      move.stop();
      if (spinner1.isSpinning) {
        spinner1.info('motor stopped!');
      }
      if (spinner2.isSpinning) {
        spinner2.info('motor stopped!');
      }
      if (spinner3.isSpinning) {
        spinner3.info('motor stopped!');
      }

      //console.log('⏹');
      break;
    case 'left':
      move.stop();
      move.turnLeft(settings.turnSpeed);
      if (spinner1.isSpinning) {
        spinner1.succeed('next');
      }
      if (spinner2.isSpinning) {
        spinner2.succeed('next');
      }
      if (spinner3.isSpinning) {
        spinner3.succeed('next');
      }
      spinner3.start();
      //console.log('↪️');
      break;
    case 'right':
      move.stop();
      move.turnRight(settings.turnSpeed);
      if (spinner1.isSpinning) {
        spinner1.succeed('next');
      }
      if (spinner2.isSpinning) {
        spinner2.succeed('next');
      }
      if (spinner3.isSpinning) {
        spinner3.succeed('next');
      }
      spinner2.start();
      break;
    case 'slow':
      process.stdout.write('\033c')
      move.stop();
      move.slow(2);
      //console.log('🔼');
      break;
    default:
      move.stop();
      if (spinner1.isSpinning) {
        spinner1.warn('command not found ... motor stopped!');
      }
      if (spinner2.isSpinning) {
        spinner2.warn('command not found ... motor stopped!');
      }
      if (spinner3.isSpinning) {
        spinner3.warn('command not found ... motor stopped!');
      }

  }
});



process.on('SIGINT', function() {
  if (spinner1.isSpinning) {
    spinner1.fail('stopping & exit');
  }
  if (spinner2.isSpinning) {
    spinner2.fail('stopping & exit');
  }
  if (spinner3.isSpinning) {
    spinner3.fail('stopping & exit');
  }
    move.stop();
    process.exit();
});
