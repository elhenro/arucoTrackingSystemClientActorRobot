var mpu6050 = require('mpu6050');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();

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

//screen.append(line, table); //must append before setting data




// detection for: turn 90 deg. left, ( counter clockwise ) 
let i = 20;
const refreshIntervalId = setInterval(() => {
    mpu.getAcceleration((err, [x, y, z]) => {
        // buffer.unshift(z / 131);
        //console.log(x/131, y/131, z/131);
        i++;
        data[3].y.push((x / 16384) - 8);
        data[3].x.push(i);
        data[3].x.shift();
        data[3].y.shift();

        data[1].y.push((y / 16384) - 1);
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
                ['/1024', x/1024, y/1024, z/1024],
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

