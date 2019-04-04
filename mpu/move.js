var mpu6050 = require('mpu6050');
const move = require('./../move');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();

const sRate = 200;
let v0 = 0;
const g = 9.81;
let way = 0;
let a = 0;
let maxa = 0;

const refreshIntervalId = setInterval(() => {
    mpu.getAcceleration((err, [x, y, z]) => {

        a = y/16384;
        if(Math.abs(a) > Math.abs(maxa)){
            maxa = a;
        }
        // console.log('a:', a);
        if (Math.abs(a) >= 0.35) {
            v0 = g * a * (1 / sRate) + v0;
        
        }

        
        way += v0 * (1 / sRate);
        
        // console.log(way);
        if(Math.abs(way) >= 0.5){
            move.stop();
            clearInterval(refreshIntervalId);
            console.log(maxa);
        }
    });
}, 1000/ sRate);



setTimeout(() => {move.forward(1); console.log('go') }, 500);


/**
 * Get 3-axis accelerometer readings.
 * These registers store the most recent accelerometer measurements.
 * Accelerometer measurements are written to these registers at the Sample Rate
 * as defined in Register 25.
 *
 * The accelerometer measurement registers, along with the temperature
 * measurement registers, gyroscope measurement registers, and external sensor
 * data registers, are composed of two sets of registers: an internal register
 * set and a user-facing read register set.
 *
 * The data within the accelerometer sensors' internal register set is always
 * updated at the Sample Rate. Meanwhile, the user-facing read register set
 * duplicates the internal register set's data values whenever the serial
 * interface is idle. This guarantees that a burst read of sensor registers will
 * read measurements from the same sampling instant. Note that if burst reads
 * are not used, the user is responsible for ensuring a set of single byte reads
 * correspond to a single sampling instant by checking the Data Ready interrupt.
 *
 * Each 16-bit accelerometer measurement has a full scale defined in ACCEL_FS
 * (Register 28). For each full scale setting, the accelerometers' sensitivity
 * per LSB in ACCEL_xOUT is shown in the table below:
 *
 * <pre>
 * AFS_SEL | Full Scale Range | LSB Sensitivity
 * --------+------------------+----------------
 * 0       | +/- 2g           | 8192 LSB/mg
 * 1       | +/- 4g           | 4096 LSB/mg
 * 2       | +/- 8g           | 2048 LSB/mg
 * 3       | +/- 16g          | 1024 LSB/mg
 * </pre>
 *
 * @param callback
 */
