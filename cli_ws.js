/*
    This script runs on
    all chairs
 */

const move = require('./move');
const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 1312});

var mpu6050 = require('mpu6050');


//! CLI config
var blessed = require('blessed'),
    contrib = require('blessed-contrib'),
    screen = blessed.screen(),
    grid = new contrib.grid({
        rows: 12,
        cols: 12,
        screen: screen
    }),


    line = grid.set(0, 0, 8, 12, contrib.line, {
        minY: -5,
        maxY: 5,
        label: 'MPU-6050 - Acceleration',
        numYLabels: 20,
        showLegend: true,
        abbreviate: false,
        xLabelPadding: 9,
        legend: {
            width: 4
        },
        style: {
            baseline: 'white'
        }


        //, wholeNumbersOnly: true
    })

    ,
    data = [{
        title: '0',
        x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        style: {
            line: 'white'
        }
    }, {
        title: 'Y',
        x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        style: {
            line: 'green'
        }
    }, {
        title: 'Z',
        x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        style: {
            line: 'yellow'
        }
    }, {
        title: 'X',
        x: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        style: {
            line: 'red'
        }
    }],
    table = grid.set(8, 0, 4, 12, contrib.table, {
        keys: true,
        fg: 'white',
        selectedFg: 'white',
        selectedBg: 'blue',
        interactive: false,
        label: 'Values',
        width: '100%',
        height: '10%',
        border: {
            type: "line",
            fg: "cyan"
        },
        columnSpacing: 5 //in chars
            ,
        columnWidth: [5, 20, 20, 20] /*in chars*/
    })


//! CLI  refresh
let i = 20;
const refreshIntervalId = setInterval(() => {
    mpu.getRotation((err, [x, y, z]) => {
        // buffer.unshift(z / 131);
        //console.log(x/131, y/131, z/131);
        i++;
        data[3].y.push((x / 131) - 8);
        data[3].x.push(i);
        data[3].x.shift();
        data[3].y.shift();

        data[1].y.push((y / 131) - 1);
        data[1].x.push(i);
        data[1].x.shift();
        data[1].y.shift();

        // data[2].y.push((z / 131) - 96 );
        // data[2].x.push(i);
        // data[2].x.shift();
        // data[2].y.shift();


        data[0].y.push(0);
        data[0].x.push(i);
        data[0].x.shift();
        data[0].y.shift();

        line.setData(data);

        table.setData({
            headers: ['TYPE', 'X', 'Y', 'Z'],
            data: [
                ['RAW', x, y, z],
                [],
                ['/16384', x / 16384, y / 16384, z / 16384],
                [],
                ['/1024', x / 1024, y / 1024, z / 1024],
                [],
                ['round', Math.round(x / 16384), Math.round(y / 16384), Math.round(z / 16384)]
            ]
        })

        screen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });

        screen.render();

    });
}, 100);





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
    //const pwm = 0.4;
    const pwm = 0.3;
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
                if (buffer.length < 1) return

                let sum;
                let bufferLength = buffer.length;
                ///console.log(buffer);
                sum = buffer.reduce((pv, cv) => pv + cv);
                sum = (sum/ bufferLength) / 10;
                if (sum < -1 || sum >= 1 ){
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
    let buffer = [];
    let total = 0;

    //* check if moving straight
    // ! test
    if (reduceBuffer != null && collectBuffer != null) {
        return;
    }

    collectBuffer = setInterval(() => {
        mpu.getRotation((err, [x, y, z]) => {
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

        if (total < 1 && total > -1) {
            //* move at same speed
            move.forward(pwm, pwm);
        }

        //TODO test directions and speeds !!

        if (total > 1 ){
            //? move to the right?
            //*        right | left
            move.forward(pwm, pwm - 0.1);
        }

        if (total < -1) {
            //? move to the left?
            //*             right | left
            move.forward(pwm - 0.1, pwm);
        }

        buffer = [];

    }, 100);


    //! remove above und keep this 
    //move.forward(pwm);

    setTimeout(() => {
        console.log(`für ${time} gefahren`)
        move.stop();
         reduceBuffer = null;
         collectBuffer = null;
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
