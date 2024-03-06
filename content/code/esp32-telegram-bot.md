---
title: Woodenbox
description: "Source code for the telegram bot running on the ESP32"
draft: false
ShowBreadCrumbs: false
ShowReadingTime: false
---

---

```cpp
#include <WiFi.h>
#include <ESPping.h>
#include <WiFiUdp.h>
#include <WakeOnLan.h>
#include <UniversalTelegramBot.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

#define LED_PIN 2
#define SERIAL_BAUD_RATE 115200
#define STARTUP_DELAY 3000

#define BOT_TOKEN "MY-VERY-SECURE-BOT-TOKEN"
#define MY_USERID "MY-VERY-SECURE-USER-ID"
#define FETCH_DELAY 30 * 1000

#define WIFI_TIMEOUT 30
#define IPINFO_ATTEMPS 3
#define NUM_PROVIDERS 6

WiFiUDP udp;
WakeOnLan wol(udp);
WiFiClientSecure secure_client;
UniversalTelegramBot bot(BOT_TOKEN, secure_client);

const char *ssid = "MY-VERY-SECURE-SSID";
const char *password = "MY-VERY-SECURE-PASSWORD";
const char *woodenbox_mac = "00:00:00:00:00:00";

String publicIPv4;
IPAddress local_ip (192, 168, 1, 199);
IPAddress gateway (192, 168, 1, 1);
IPAddress subnet (255, 255, 255, 0);
IPAddress dns1 (1, 1, 1, 1);
IPAddress dns2 (1, 0, 0, 1);
IPAddress woodenbox (192, 168, 1, 200);
IPAddress nas_container (192, 168, 1, 201);
IPAddress vpn_container (192, 168, 1, 202);

// "Providers" are reliable ip addresses which can
//  be used to check if internet is reachable
int current_provider = 0;
IPAddress cloudflare (1, 1, 1, 1);
IPAddress quad9 (9, 9, 9, 9);
IPAddress level3 (4, 2, 2, 2);
IPAddress google1 (8, 8, 8, 8);
IPAddress google2 (8, 8, 4, 4);
IPAddress opendns (208, 67, 222, 222);
IPAddress providers[NUM_PROVIDERS] {
    cloudflare,
    quad9,
    level3,
    google1,
    google2,
    opendns
};


void handleNewMessages(int n_new_messages) {
	
	if (!n_new_messages) {
		return;
	}

	for (int i = 0; i < n_new_messages; i++) {

		// Light up the led if someone else tried to access the bot
		if (bot.messages[i].from_id != MY_USERID) {
			digitalWrite(LED_PIN, HIGH);
			continue;
		}

		String text = bot.messages[i].text;

		if (text == "/boot") {
			Serial.printf("\nReceived /boot command");
			wol.sendMagicPacket(woodenbox_mac);
			bot.sendMessage(MY_USERID, "WakeOnLan packet sent to woodenbox", "");
		} 
		else if (text == "/status") {
			Serial.printf("\nReceived /status command");
            String message = "\n*woodenbox* is ";
            message += (Ping.ping(woodenbox)) ? "_up_" : "_down_";
            message += "\n*nas* container is ";
            message += (Ping.ping(nas_container)) ? "_up_" : "_down_";
            message += "\n*vpn* container is ";
            message += (Ping.ping(vpn_container)) ? "_up_" : "_down_";
			bot.sendMessage(MY_USERID, message, "MarkdownV2");
		}
		else if (text == "/ip") {
			Serial.printf("\nReceived the /ip command");
            publicIPv4 = getPublicIPv4();
			bot.sendMessage(MY_USERID, "Public IPv4: " + publicIPv4, "");
		}
		else if (text == "/ledoff") {
			Serial.printf("\nReceived the /ledoff command");
			digitalWrite(LED_PIN, LOW);
			bot.sendMessage(MY_USERID, "Turned OFF the led on the ESP32", "");
		}
        else if (
            text != "/suspend"  &&
            text != "/reboot"   &&
            text != "/poweroff" &&
            text != "/startvpn" &&
            text != "/stopvpn"
        ) {
			Serial.printf("\nReceived a bad command, sending usage instructions...");
			String message = "*Usage*";
            message += "\n\n__ESP32's commands__:";
			message += "\n/boot, /status, /ip, /ledoff";
            message += "\n\n__woodenbox's commands__:";
            message += "\n/suspend, /reboot, /poweroff, /startvpn, /stopvpn";
			message += "\n\n_Messages are fetched approximately every ";
            char fetch_delay_str[3];
            message += itoa(FETCH_DELAY/1000, fetch_delay_str, 10);
            message += " seconds_";
			bot.sendMessage(MY_USERID, message, "MarkdownV2");
		}

  	}

}


void discardOldMessages() {
	while (bot.getUpdates(bot.last_message_received + 1)) {
		delay(1000);
	}
}


// Returns the public IPv4 of the ESP32, restarts the board if any error occours
String getPublicIPv4() {
	HTTPClient http;
	http.begin("http://ipinfo.io/ip");

	int attemps = 0;
	while(http.GET() != 200) {
		if(attemps >= IPINFO_ATTEMPS){
			ESP.restart();
		}
		delay(1000);
        attemps++;
	}

	String response = http.getString();
	http.end();
	return response;
}


void setup(){
	Serial.begin(SERIAL_BAUD_RATE);
	delay(STARTUP_DELAY);

	Serial.printf("\n\n### BOARD RESET ###\n");
	
	pinMode(LED_PIN,OUTPUT);
	wol.setRepeat(3, 100);
	WiFi.mode(WIFI_STA);
    WiFi.config(local_ip, gateway, subnet, dns1, dns2);
	WiFi.begin(ssid, password);
	
	Serial.printf("\nConnecting to %s", ssid);
	
	int wifi_timeout_counter = 0;
	while(WiFi.status() != WL_CONNECTED){
		Serial.print(".");
		delay(1000);

		wifi_timeout_counter++;
		if(wifi_timeout_counter >= WIFI_TIMEOUT){
			if (i == NUM_WIFI - 1) ESP.restart();
			else {
				Serial.printf("X");
				break;
			}
		}
	}

	Serial.printf("\nLocal ESP32 IPv4: %s", WiFi.localIP().toString());
    publicIPv4 = getPublicIPv4();
	Serial.printf("\nPublic ESP32 IPv4: %s", publicIPv4.c_str());

	secure_client.setCACert(TELEGRAM_CERTIFICATE_ROOT);

	Serial.printf("\nDiscarding old messages...");
	discardOldMessages();
	Serial.printf("\nWaiting for new messages...");

	bot.sendMessage(MY_USERID, "*DEBUG*: _ESP32 has just restarted_", "MarkdownV2");
}


void loop() {

    // Checks if internet is reachable (twice if the first check fails)
    IPAddress *provider = &providers[current_provider];
    if (!Ping.ping(*provider) && !Ping.ping(*provider)) {
        ESP.restart();
	}

	// Cycles between providers to avoid always pinging the same one
    current_provider = (current_provider + 1) % NUM_PROVIDERS;

	int n_new_messages = bot.getUpdates(bot.last_message_received + 1);	
	handleNewMessages(n_new_messages);

	delay(FETCH_DELAY);	
}
```
