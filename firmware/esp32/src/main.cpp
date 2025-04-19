#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <LiquidCrystal.h>
#include <vector>
#include <time.h>

// Update these with your network credentials
const char* ssid = "Abhranshu_Nothing";
const char* password = "riceeater21";

// LCD pin setup: RS -> GPIO13, E -> GPIO12, D4->14, D5->27, D6->26, D7->25
LiquidCrystal lcd(13, 12, 14, 27, 26, 25);

// Buzzer pin and PWM channel
const int buzzerPin = 33;
const int buzzerChannel = 0;
const int buzzerFreq = 1500;        // 1500 Hz tone
const int buzzerResolution = 8;     // 8-bit resolution

const int buttonPin = 4;               // Button input pin (pull-up)
bool isAlertActive = false;
// Define slot indicator LEDs
const int ledSlot1Pin = 18;
const int ledSlot2Pin = 19;
unsigned long alertStartTime = 0;

WebServer server(80);

struct Reminder {
  String name;
  String slot;
  int hour;
  int minute;
  bool triggered;
};
static std::vector<Reminder> reminders;

void handleUpdate() {
  if (server.hasArg("name") && server.hasArg("slot") && server.hasArg("hour") && server.hasArg("minute")) {
    String name = server.arg("name");
    String slot = server.arg("slot");
    int hour = server.arg("hour").toInt();
    int minute = server.arg("minute").toInt();
    // Show receive message
    lcd.clear();
    lcd.print("Reminder received");
    delay(1000);
    // Store reminder
    reminders.push_back({name, slot, hour, minute, false});
    // Removed immediate display; LCD will show at the scheduled time
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Missing parameters");
  }
}

void setup() {
  Serial.begin(115200);
  lcd.begin(16, 2);

  // Setup buzzer PWM
  ledcSetup(buzzerChannel, buzzerFreq, buzzerResolution);
  ledcAttachPin(buzzerPin, buzzerChannel);
  ledcWrite(buzzerChannel, 0);  // off

  // Configure button with internal pull-up
  pinMode(buttonPin, INPUT_PULLUP);

  // Configure slot indicator LEDs
  pinMode(ledSlot1Pin, OUTPUT);
  pinMode(ledSlot2Pin, OUTPUT);
  digitalWrite(ledSlot1Pin, LOW);
  digitalWrite(ledSlot2Pin, LOW);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());

  // Set your local timezone offset here (seconds east of UTC). Example: IST = 5h30m = +19800
  const long gmtOffset_sec = 5 * 3600 + 30 * 60;  // adjust to your timezone
  const int daylightOffset_sec = 0;
  configTime(gmtOffset_sec, daylightOffset_sec, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for time");
  while (time(nullptr) < 100000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  server.on("/update", HTTP_GET, handleUpdate);
  server.begin();
}

void loop() {
  server.handleClient();
  struct tm timeinfo;
  if (getLocalTime(&timeinfo)) {
    static int lastMinute = -1;
    int h = timeinfo.tm_hour;
    int m = timeinfo.tm_min;
    // Reset triggers at midnight
    if (h == 0 && m == 0) {
      for (auto &r : reminders) r.triggered = false;
    }
    if (m != lastMinute) {
      for (auto &r : reminders) {
        if (!r.triggered && r.hour == h && r.minute == m) {
          // Debug: indicate which reminder is firing
          Serial.printf("Triggering reminder: %s at slot %s\n", r.name.c_str(), r.slot.c_str());
          lcd.clear();
          lcd.print(r.name);
          lcd.setCursor(0, 1);
          lcd.print("Slot: " + r.slot);
          // Start buzzer and mark alert active
          ledcWrite(buzzerChannel, 128);  // 50% duty tone start
          isAlertActive = true;
          alertStartTime = millis();
          // Turn on the LED for the proper slot
          if (r.slot == "1") digitalWrite(ledSlot1Pin, HIGH);
          else if (r.slot == "2") digitalWrite(ledSlot2Pin, HIGH);
          r.triggered = true;
        }
      }
      lastMinute = m;
    }
  }
  // Handle alert: clear only on button press, no auto timeout
  if (isAlertActive) {
    if (digitalRead(buttonPin) == LOW) {
      // Button pressed: stop buzzer, clear display, turn off LEDs
      ledcWrite(buzzerChannel, 0);
      lcd.clear();
      digitalWrite(ledSlot1Pin, LOW);
      digitalWrite(ledSlot2Pin, LOW);
      isAlertActive = false;
    }
  }
}