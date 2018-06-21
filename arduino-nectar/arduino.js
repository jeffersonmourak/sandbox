var arduino = require("arduino");
var other = require("./other");

var ledPin = 9;
var low = arduino.LOW;
var high = arduino.HIGH;
var value = 0;

arduino.pinMode(ledPin, arduino.OUTPUT); 

while(1)
{
  arduino.analogWrite(ledPin, value %  256);
  value += 5;
  arduino.delay(100);
}