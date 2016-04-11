/* ColorPal Sensor Example for Arduino
  Author: Martin Heermance, with some assistance from Gordon McComb
  This program drives the Parallax ColorPAL color sensor and provides
  serial RGB data in a format compatible with the PC-hosted 
  TCS230_ColorPAL_match.exe color matching program.
*/

#include <SoftwareSerial.h>

const int sio = 2;			// ColorPAL connected to pin 2
const int unused = 255; 		// Non-existant pin # for SoftwareSerial
const int sioBaud = 4800;
const int waitDelay = 200;

// Received RGB values from ColorPAL
int red;
int grn;
int blu;

// Black Reference correction
const int Kr = 22;
const int Kg = 17;
const int Kb = 33;

// White Reference correction
const int Wr = 0;
const int Wg = 0;
const int Wb = 0;

const int redLed = 11;
const int grnLed = 10;
const int bluLed = 9;
const int brightness = 255;

// Set up two software serials on the same pin.
SoftwareSerial serin(sio, unused);
SoftwareSerial serout(unused, sio);

void setup() {
  Serial.begin(9600);
  reset(); // Send reset to ColorPal
  serout.begin(sioBaud);
  pinMode(sio, OUTPUT);
  serout.print("=(00 $ m)!"); // Loop print values, see ColorPAL documentation
  serout.end();			            // Discontinue serial port for transmitting

  serin.begin(sioBaud);	        // Set up serial port for receiving
  pinMode(sio, INPUT);

  pinMode(redLed, OUTPUT);      // Set up LED's for output
  pinMode(grnLed, OUTPUT);
  pinMode(bluLed, OUTPUT);
}

void loop() {
  readData();
}  

// Reset ColorPAL; see ColorPAL documentation for sequence
void reset() {
  delay(200);
  pinMode(sio, OUTPUT);
  digitalWrite(sio, LOW);
  pinMode(sio, INPUT);
  while (digitalRead(sio) != HIGH);
  pinMode(sio, OUTPUT);
  digitalWrite(sio, LOW);
  delay(80);
  pinMode(sio, INPUT);
  delay(waitDelay);

  analogWrite(redLed, 0);        // Set LED's Off
  analogWrite(grnLed, 0);        
  analogWrite(bluLed, 0);        
}

// $001002003$$001002003
void readData() {
  char buffer[32];
  
  if (serin.available() > 0) {
    // Wait for a $ character, then read three 3 digit hex numbers
    buffer[0] = serin.read();
    if (buffer[0] == '$') {
      for(int i = 0; i < 9; i++) {
        while (serin.available() == 0);     // Wait for next input character
        buffer[i] = serin.read();
        if (buffer[i] == '$')               // Return early if $ character encountered
          return;
      }
//      sendRawData(buffer);
      parse(buffer);

      if(red > 500 || grn > 500 || blu > 500) {
        //sendWarning();
        delay(500);
        return; // throw away any sample that is out of range
      }
      sendData();
      updateLEDs();
      delay(500);
    }
  }
}

// Parse the hex data into integers
void parse(char * data) {
  sscanf (data, "%3x%3x%3x", &red, &grn, &blu);
//  red = 255 * (red - Kr) / (Wr - Kr);
//  grn = 255 * (grn - Kg) / (Wg - Kg);
//  blu = 255 * (blu - Kb) / (Wb - Kb);
//  red = red < 0 ? 0: red;
//  grn = grn < 0 ? 0: grn;
//  blu = blu < 0 ? 0: blu;  
}

void sendData() {
  char buffer[32];
  sprintf(buffer, "R%4.4d G%4.4d B%4.4d", red, grn, blu);
//  sprintf(buffer, "%2.2x%2.2x%2.2x", red, grn, blu);

  Serial.println(buffer);     
}

void sendWarning() {
  char buffer[32];
  sprintf(buffer, "Warning: R%4.4d G%4.4d B%4.4d", red, grn, blu);

  Serial.println(buffer);     
}

void sendRawData(char * data) {
  Serial.println(data);     
}


void updateLEDs() {
  //Serial.println(red);
  //Serial.println(grn);
  //Serial.println(blu);
  
  analogWrite(redLed, red / 10);        // Write LED values
  analogWrite(grnLed, grn / 10);        
  analogWrite(bluLed, blu / 10); 
}


