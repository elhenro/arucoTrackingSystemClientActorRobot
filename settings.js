//! ip:     10.51.5.57
//! id:     15

module.exports= {

 id : 15,
 consoleColor : "red",
 emoji: 🐯,

 moveSpeed  : 1,
 turnSpeed : 0.3,
 turnSpeedSlow : 0.2,
 frequency : 30,


//! pin setup ///

//* forward
forward: {
    pin1 :  1,
    pin2 : 0,
    pin3 : 0,
    pin4 : 1,
},

//* left
left: {
    pin1 : 1,
    pin2 : 0,
    pin3 : 1,
    pin4 : 0,
},

//* right
right: {
    pin1 : 0,
    pin2 : 1,
    pin3 : 0,
    pin4 : 1,
},

//* back
back: {
    pin1 : 0,
    pin2 : 1,
    pin3 : 1,
    pin4 : 0,
}

}