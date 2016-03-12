var five = require("johnny-five");
var Firebase = require("firebase");

var assetsRef = new Firebase("https://myjarvis.firebaseio.com/assets/");

var isOn = false;
var isDockedIn = false;
var assetId = 'EE1';
var board = new five.Board();

board.once('ready', function() {

  var ee1_led13 = new five.Led(13);
  var alertLED = new five.Led(9);

  assetsRef.child(assetId).child('batteryStatus').on("value", function(snapshot) {
    isDockedIn = snapshot.child('isDocked').val();
		console.log('isDockedIn ' + isDockedIn);
		isDockedIn ? alertLED.off() : alertLED.on();
	});

  assetsRef.child(assetId).child('batteryStatus').on("value", function(snapshot) {
    var ee1BatteryLevel = snapshot.child('level').val();
    var isDocked = snapshot.child('isDocked').val();
    if (isDocked && ee1BatteryLevel === 100) {
      isOn = false;
    } else if (isDocked && ee1BatteryLevel !== 100) {
      isOn = true;
    } else if (!isDocked) {
      isOn = false;
    }

    isOn ? ee1_led13.on() : ee1_led13.off();
    console.log('At End ' + isOn);
  });

  this.repl.inject({
    led: ee1_led13
  });
});
