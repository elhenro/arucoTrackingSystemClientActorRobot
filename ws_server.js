/*
    This script runs on
    all chairs
 */
const settings = require('./settings');
const move = require('./move');
const WebSocket = require('ws');
const chalk = require('chalk');

const wss = new WebSocket.Server({port: 1312});

var mpu6050 = require('mpu6050');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();
let reduceBuffer = null;
let collectBuffer = null;
let chairBusy = false;

function checkDeg(ws, deg) {
    chairBusy = true;
    if (reduceBuffer != null && collectBuffer != null) {
        return;
    }
    if (chairBusy == false) {
        return;
    }
    let buffer = [];
    let total = 0;
    const puffer = 0;
    //const pwm = 0.4;
    const pwmR = settings.turnSpeedR;
    const pwmL = settings.turnSpeedL;
    let direction = "";

    if (deg > 0) {
        move.turnRight(pwmR, pwmL);
        direction = "right";
    } else {
        move.turnLeft(pwmR, pwmL);
    }

    collectBuffer = setInterval(() => {
        mpu.getRotation((err, [x, y, z] = [0, 0, 0]) => {
            if(err){
                console.log(chalk.keyword('red')('mpu error!!!'))
                return
            }
             buffer.unshift(z / 131);

        });
    }, 10);


    reduceBuffer = setInterval(() => {
        if (buffer.length < 1) return

        let sum;
        let bufferLength = buffer.length;
        ///console.log(buffer);
        sum = buffer.reduce((pv, cv) => pv + cv);
        sum = (sum / bufferLength) / 10;
        if (sum < -1 || sum >= 1) {
            total = total + sum;
        }

        // decrease speed for final fine-tuning
        /*
        if (Math.abs(deg) - 15 <= Math.abs(total)) {
            console.log('slow');
            if (direction == "right") {
                move.turnRight(pwmSlow);
            }else{
                move.turnLeft(pwmSlow);
            }
        }*/


        // stop if arrived at final angle
        if (Math.abs(deg) - 2 <= Math.abs(total)) {
            console.log(chalk.keyword(settings.consoleColor)(`um ${total} gedreht`));
            move.stop();
            clearInterval(reduceBuffer && collectBuffer);
            reduceBuffer = null;
            collectBuffer = null;
            setTimeout(() => {
                //ws.send(JSON.stringify({chairBusy: false}));
                ws.send(JSON.stringify({chairBusy: false}), function (error) {
                    console.log(chalk.keyword(settings.consoleColor)("send busy: false"));
                });

                return;
            }, 500);

        }
        buffer = [];

    }, 100);

}


function checkDist(ws, dist) {
    const space = settings.moveSpace;
    const speed = settings.moveSpeed;  //cm pro sec
    const pwmR = settings.moveSpeedR;
    const pwmL = settings.moveSpeedL
    // dist  in cm 
    let time = ((dist / space) / speed) * 1000;

    // //* check if moving straight
    // // ! test
    // if (reduceBuffer != null && collectBuffer != null) {
    //     return;
    // }

    // collectBuffer = setInterval(() => {
    //     mpu.getRotation((err, [x, y, z]) => {
    //         buffer.unshift(z / 131);
    //     });
    // }, 10);


    // reduceBuffer = setInterval(() => {
    //     if (buffer.length < 1) return

    //     let sum;
    //     let bufferLength = buffer.length;
    //     ///console.log(buffer);
    //     sum = buffer.reduce((pv, cv) => pv + cv);
    //     sum = (sum / bufferLength) / 10;
    //     if (sum < -1 || sum >= 1) {
    //         total = total + sum;
    //     }

    //     if (total < 1 && total > -1) {
    //         //* move at same speed
    //         move.forward(pwm, pwm);
    //     }

    //     //TODO test directions and speeds !!

    //     if (total > 1 ){
    //         //? move to the right?
    //         //*        right | left
    //         move.forward(pwm, pwm - 0.1);
    //     }

    //     if (total < -1) {
    //         //? move to the left?
    //         //*             right | left
    //         move.forward(pwm - 0.1, pwm);
    //     }

    //     buffer = [];

    // }, 100);


    //! remove above und keep this 
    move.forward(pwmR, pwmL);

    setTimeout(() => {
        console.log(chalk.keyword(settings.consoleColor)(`für ${time} gefahren`));
        move.stop();
        ws.send(JSON.stringify({chairBusy: false}));
    }, time);
}


console.log(chalk.keyword(settings.consoleColor)('Websocket listens on port 1312 ...', settings.emoji, settings.id));
wss.on('connection', function connection(ws) {
    ws.send(JSON.stringify({chairready: true}));
    console.log(chalk.keyword(settings.consoleColor)('some boi connected ✅'));
    
    ws.on('message', function incoming(message) {
        console.log(chalk.keyword(settings.consoleColor)('received: %s', message));
        message = JSON.parse(message);
        if (message.motionType === "Rotation") {
            // if (message.angle > 0) {
            //     checkDeg(message.angle)
            //     move.turnRight(message.velocity);
            // } else {
            //     move.turnLeft(message.velocity);
            // }
            ws.send(JSON.stringify({chairBusy: true}));
            checkDeg(ws, message.value);

        } else if (message.motionType === "Straight") {

            ws.send(JSON.stringify({chairBusy: true}));
            checkDist(ws, message.value);

        } else if (message.motionType === "Stop") {

            ws.send(JSON.stringify({chairBusy: false}));
            move.stop();
        }
    });

    ws.on('close', function (data) {
        console.log(chalk.keyword(settings.consoleColor)('closed connection', data, settings.emoji));
        move.stop();
    });
});


process.on('SIGINT', function () {
    move.stop();
    process.exit();
});
