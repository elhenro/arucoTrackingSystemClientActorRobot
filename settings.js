//! ip:     10.51.5.57
//! id:     15

module.exports= {

 id : 15,
 consoleColor: "orange",
 emoji: '🐯',

 moveSpeed  : 1,  //! keep for older versions 
 turnSpeed : 0.4, //!  --- || ---

 frequency : 30, // pwm frequency

 moveSpeedR : 1,
 moveSpeedL: 1,

 turnSpeedR : 0.4,
 turnSpeedL : 0.4,


 //! move forward time  //
 moveSpace : 25, // 25cm chair size
 moveTime : 2, // 18.8 cm pro sec.


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
