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
let reduceBuffer  = null;
let collectBuffer = null;

function checkDeg(ws, deg){
    if (reduceBuffer != null && collectBuffer != null) {
    return;
  }
    let buffer = [];
    let total = 0;
    const puffer = 0;
    const pwm = 0.5;
    const pwmSlow  = 0.3;
    let direction = "";
    
    if (deg > 0) {
      move.turnRight(pwm);
      direction = "right";
    }
    else {
        move.turnLeft(pwm);
    }

    collectBuffer = setInterval(() => {
        mpu.getRotation((err, [x, y, z]) => {
            buffer.unshift(z / 131);
        });
    }, 10);

    

     reduceBuffer  = setInterval(() => {
       
                let sum;
                let bufferLength = buffer.length;
                sum = buffer.reduce((pv, cv) => pv + cv);
                sum = (sum/ bufferLength) * 100;
                console.log('berechne');
                if (sum < -1 || sum >= 1 ){
                    total = total + sum;
                }

                // decrease speed for final fine-tuning
                if (Math.abs(deg) - 15 <= Math.abs(total)) {
                    console.log('slow');
                    if (direction == "right") {
                        move.right(pwmSlow);
                    }else{
                        move.left(pwmSlow);
                    }
                }


                // stop if arrived at final angle
                if (Math.abs(deg) - 2 <= Math.abs(total)){
                    console.log(`um ${total} gedreht`)
                    move.stop();
                    clearInterval(reduceBuffer && collectBuffer);
                    reduceBuffer = null;
                    collectBuffer = null;
                    setTimeout(() => {
                        ws.send(JSON.stringify({chairBusy: false}));
                        return
                    }, 2000);
                    
                }
                buffer = [];
          
    }, 100);

}


function checkDist (ws, dist){
    const space = 25;
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
console.log('new');
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
