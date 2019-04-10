/*
    This script runs on
    all chairs
 */

const move = require('./move');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 1312});

var mpu6050 = require('mpu6050');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();
let refreshIntervalId  = null;

function checkDeg(ws, deg){
  if (refreshIntervalId != null) {
    // console.log('läft', refreshIntervalId);
    return;
  }
    let buffer = [];
    let total = 0;
    const puffer = 0;
    const pwm = 0.5;
    
    // ??? was das
    //ws.send('')
    // detection for: turn 90 deg. left, ( counter clockwise )

    if (deg > 0) {
      move.turnRight(pwm);
    }
    else {
        move.turnLeft(pwm);
    }

     refreshIntervalId  = setInterval(() => {
        mpu.getRotation((err, [x,y,z]) =>{
            buffer.unshift(z/131);
            if (buffer.length >= 10) {
                let sum;
                sum = buffer.reduce((pv, cv) => pv + cv);
                sum = sum/40;

                if (sum < -1 || sum >= 1 ){
                    total = total + sum;
                }

                // console.log(total)
                if (Math.abs(deg) - 5 <= Math.abs(total)){
                    console.log(`um ${deg} gedreht`)
                    move.stop();
                    clearInterval(refreshIntervalId);
                    refreshIntervalId = null;
                    ws.send(JSON.stringify({chairBusy: false}));
                    return
                }
                buffer = [];
            }
        });
    }, 25);

}


function checkDist (ws, dist){
    const space = 20;
    const speed = 18.8;  //cm pro sec
    const pwm = 1;
    // dist  in cm 
    let time = ((dist / space) / speed) * 1000;

    move.forward(pwm);

    setTimeout(() => {
        console.log(`für ${time} gefahren`)
        move.stop();
        ws.send(JSON.stringify({ chairBusy: false }));
    }, time);
}


console.log('Websocket listens on port 1312 acab...');
wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({chairready: true}));

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        message = JSON.parse(message);
        if (message.motionType === "Rotation") {
            // if (message.angle > 0) {
            //     checkDeg(message.angle)
            //     move.turnRight(message.velocity);
            // } else {
            //     move.turnLeft(message.velocity);
            // }
            ws.send(JSON.stringify({chairBusy: true})); checkDeg(ws, message.value);

        } else if (message.motionType === "Straight") {
            
            
            ws.send(JSON.stringify({chairBusy: true})); checkDist(ws, message.value);
            
        } else if (message.motionType === "Stop") {

            ws.send(JSON.stringify({chairBusy: false}));
            move.stop();
        }
    });

    ws.on('close', function (data) {
        console.log('closed connection', data);
        move.stop();
    });
});


process.on('SIGINT', function() {
    move.stop();
    process.exit();
});
