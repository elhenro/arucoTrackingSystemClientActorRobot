var mpu6050 = require('mpu6050');

// Instantiate and initialize.
var mpu = new mpu6050();
mpu.initialize();

// // Test the connection before using.
// mpu.testConnection(function(err, testPassed) {
//   if (testPassed) {

//     // Put the MPU6050 back to sleep.
//     mpu.setSleepEnabled(1);
//   }
// });

function visual(sum){
    if (sum < -14 && sum > -20) {
        console.log('  ----------|')
    }
    if (sum < -10 && sum > -14) {
        console.log('    --------|')
    }
    if (sum < -7 && sum > -10) {
        console.log('     -------|')
    }
    if (sum < -5 && sum > -7) {
        console.log('      ------|')
    }
    if (sum < -3 && sum > -5) {
        console.log('       -----|')
    }
    if (sum < -2 && sum > -3) {
        console.log('        ----|')
    }
    if (sum < -1 && sum > -2) {
        console.log('         ---|')
    }
    if (sum < -0.5 && sum > -1) {
        console.log('          --|')
    }
    if (sum < 0 && sum > -0.5) {
        console.log('           -|')
    }
    if (sum > 0 && sum < 0.5) {
        console.log('            |-')
    }
    if (sum > 0.5 && sum < 1) {
        console.log('            |--')
    }
    if (sum > 1 && sum < 2) {
        console.log('            |---')
    }
    if (sum > 2 && sum < 3) {
        console.log('            |----')
    }
    if (sum > 3 && sum < 5) {
        console.log('            |-----')
    }
    if (sum > 5 && sum < 7) {
        console.log('            |------')
    }
    if (sum > 7 && sum < 10) {
        console.log('            |-------')
    }
    if (sum > 10 && sum < 14) {
        console.log('            |--------')
    }
    if (sum > 14 && sum < 20) {
        console.log('            |-----------')
    }
}



function checkDeg(deg){

    let buffer = [];
    let total = 0;
    const puffer = 0;

    // detection for: turn 90 deg. left, ( counter clockwise )

    const refreshIntervalId  = setInterval(() => {
        mpu.getRotation((err, [x,y,z]) =>{
            buffer.unshift(z/131);
            if (buffer.length >= 10) {
                let sum;
                sum = buffer.reduce((pv, cv) => pv + cv);
                sum = sum/40;

                //start move function

                visual(sum);

                if (sum < -1 || sum >= 1 ){
                    total = total + sum;
                }

                console.log(total)
                if (deg + puffer < 0){
                    if (total <= deg) {
                        console.log(`um ${deg} gedreht`)

                        //stop move function

                        clearInterval(refreshIntervalId);
                    }
                }
                else{
                    if (total >= deg - puffer) {
                        console.log(`um ${deg} gedreht`)

                        //stop move function

                        clearInterval(refreshIntervalId);
                    }
                }

                buffer = [];
            }
        });
    }, 25);
}


checkDeg(-90);

/**
 * Get 3-axis gyroscope readings.
 * These gyroscope measurement registers, along with the accelerometer
 * measurement registers, temperature measurement registers, and external sensor
 * data registers, are composed of two sets of registers: an internal register
 * set and a user-facing read register set.
 * The data within the gyroscope sensors' internal register set is always
 * updated at the Sample Rate. Meanwhile, the user-facing read register set
 * duplicates the internal register set's data values whenever the serial
 * interface is idle. This guarantees that a burst read of sensor registers will
 * read measurements from the same sampling instant. Note that if burst reads
 * are not used, the user is responsible for ensuring a set of single byte reads
 * correspond to a single sampling instant by checking the Data Ready interrupt.
 *
 * Each 16-bit gyroscope measurement has a full scale defined in FS_SEL
 * (Register 27). For each full scale setting, the gyroscopes' sensitivity per
 * LSB in GYRO_xOUT is shown in the table below:
 *
 * <pre>
 * FS_SEL | Full Scale Range   | LSB Sensitivity
 * -------+--------------------+----------------
 * 0      | +/- 250 degrees/s  | 131 LSB/deg/s
 * 1      | +/- 500 degrees/s  | 65.5 LSB/deg/s
 * 2      | +/- 1000 degrees/s | 32.8 LSB/deg/s
 * 3      | +/- 2000 degrees/s | 16.4 LSB/deg/s
 * </pre>
 *

 */
