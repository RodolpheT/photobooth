
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN_LEDRING 17
#define PIN_BUTTON 2

Adafruit_NeoPixel strip = Adafruit_NeoPixel(60, PIN_LEDRING, NEO_RGBW + NEO_KHZ800);
int buttonState = 0; 

void setup() {
  pinMode(13, OUTPUT);
  pinMode(PIN_BUTTON, INPUT_PULLUP);
  Serial.begin(9600);
  
  strip.begin();
  strip.setBrightness(10);
  strip.show(); // Initialize all pixels to 'off'

  digitalWrite(13, HIGH); //lighting up the built-in led to give proof of life
}

void loop() {
  strip.setBrightness(15);
  if (!digitalRead(PIN_BUTTON)) {
    delay(50);
    if(!digitalRead(PIN_BUTTON)){
        buttonPressedSequence();  //calling the light sequence + serial request for picture
    }
  }
   fullColor(strip.Color(0,0,0));
   
  //rainbowMiddle(50);
 
}

void buttonPressedSequence(){
  fullColor(strip.Color(0,0,0));
  delay(200);
  fullColor(strip.Color(255,0,0));
  delay(200);
  fullColor(strip.Color(0,0,0));
  delay(200);
  fullColor(strip.Color(255,0,0));
  delay(200);
  fullColor(strip.Color(0,0,0));
  delay(200);
  fullColor(strip.Color(255,0,0));
  colorWipe(strip.Color(0,0, 0), 70); // Green
  //strip.setBrightness(200);
  fullColor(strip.Color(255,255,255));
  delay(100);
  Serial.println("PictureRequest"); 
  delay(2000);
}

void fullColor(uint32_t c){
  for(uint16_t i=0;i<strip.numPixels();i++){
      strip.setPixelColor(i,c);
      }
  strip.show();
}

// Empty all strip
void resetStrip(){
  for(uint16_t i=0;i<strip.numPixels();i++){
      strip.setPixelColor(i,0,0,0);
      }
  strip.show();
}
 
// Fill the dots one after the other with a color and reset the trail to create a n length snake
void colorSnake(uint32_t c, uint8_t snakeLength, uint8_t wait) {
  resetStrip();
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);

      if(i>snakeLength){
            strip.setPixelColor(i-snakeLength, 0, 0, 0);
      }

      strip.show();
      delay(wait);
  }
}    
// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {

  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, c);
      strip.show();
      delay(wait);
  }
}

//Create a blinker effect in the direction required (1= right, 0=left)
void blinkerMode(uint8_t blinkerDirection){
uint8_t i, j,k;

for(k=0;k<3;k++){
    resetStrip();
    for(i=25;i<37;i++){
      strip.setPixelColor(60-i, 250,173-2*i,22);
      strip.show();
      delay(55);
    }
    
    for(j=0;j<4;j++){
      resetStrip();
      delay(200);
      for(i=23;i>0;i--){
        strip.setPixelColor(i,255,0,0);
      }
      strip.show();
      delay(200);
    }
}
}

// Fill the dots one after the other with a color
void colorWipeReverse(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(strip.numPixels()-i, c);
      strip.show();
      delay(wait);
  }
}

// Fill the dots one after the other with a color
void colorWipeMiddle(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<strip.numPixels()/2; i++) {
      strip.setPixelColor(i+strip.numPixels()/2, c);
	  strip.setPixelColor(strip.numPixels()/2-i, c);
      strip.show();
      delay(wait);
  }
}

// Fill the dots one after the other with a color
void rainbowMiddle(uint8_t wait) {

uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels()/2; i++) {
      strip.setPixelColor(i+strip.numPixels()/2, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
	  strip.setPixelColor(strip.numPixels()/2-i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256*5; j++) { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

//Theatre-style crawling lights.
void theaterChase(uint32_t c, uint8_t wait) {
  for (int j=0; j<10; j++) {  //do 10 cycles of chasing
    for (int q=0; q < 3; q++) {
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, c);    //turn every third pixel on
      }
      strip.show();
     
      delay(wait);
     
      for (int i=0; i < strip.numPixels(); i=i+3) {
        strip.setPixelColor(i+q, 0);        //turn every third pixel off
      }
    }
  }
}

//Theatre-style crawling lights with rainbow effect
void theaterChaseRainbow(uint8_t wait) {
  for (int j=0; j < 256; j++) {     // cycle all 256 colors in the wheel
    for (int q=0; q < 3; q++) {
        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, Wheel( (i+j) % 255));    //turn every third pixel on
        }
        strip.show();
       
        delay(wait);
       
        for (int i=0; i < strip.numPixels(); i=i+3) {
          strip.setPixelColor(i+q, 0);        //turn every third pixel off
        }
    }
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
   return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  } else if(WheelPos < 170) {
    WheelPos -= 85;
   return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  } else {
   WheelPos -= 170;
   return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
  }
}
