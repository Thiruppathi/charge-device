var five = require("johnny-five");
var Firebase = require("firebase");

var assetsRef = new Firebase("https://myjarvis.firebaseio.com/assets/");

var isOn = false;
var assetId = 'EE1';
var board = new five.Board();

board.once('ready', function() {

  var ee1_led13 = new five.Led(13);
  var alertLED = new five.Led(9);
  var amberLED = new five.Led(5);

  assetsRef.child(assetId).child('batteryStatus').on("value", function(snapshot) {
    var ee1BatteryLevel = snapshot.child('level').val();
    var isDocked = snapshot.child('isDocked').val();
    var isDanger = snapshot.child('isDanger').val();
    var isAmber = snapshot.child('isAmber').val();

    console.log('isDanger', isDanger);
    if (isDocked && ee1BatteryLevel === 50) {
      isOn = false;
    } else if (isDocked && ee1BatteryLevel !== 50) {
      isOn = true;
    } else if (!isDocked) {
      isOn = false;
    }
    isOn ? ee1_led13.on() : ee1_led13.off();
    if (isDanger) {
      alertLED.on();
      amberLED.off();
    } else {
      alertLED.off();
    }

    if (isAmber) {
      alertLED.off();
      amberLED.on();
    } else {
      amberLED.off();
    }

  });

  this.repl.inject({
    led: ee1_led13
  });
});
