---
title: Woodenbox
description: "Source code of the telegram bot running on the ESP32"
draft: false
ShowBreadCrumbs: false
ShowReadingTime: false
---

---

```cpp
/* Core libraries */
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>

/* Other libraries */
#include <ArduinoJson.h>
#include <UniversalTelegramBot.h>
#include <ESPping.h>
#include <WakeOnLan.h>

#define TELEGRAM_TOKEN 	"REDACTED"
#define SSID 			"REDACTED"
#define PASSWORD 		"REDACTED"

#define SERIAL_BAUD_RATE 		115200
#define STARTUP_DELAY_MS 		3000
#define HOSTNAME				"ESP32"
#define CONNECTION_ATTEMPS_MAX 	60
#define DELAY_MS			 	1000
#define WOL_ATTEMPS_MAX 		5
#define WOL_DELAY_MS 			100
#define MY_USERID 				"REDACTED"
#define LONG_POLL_S				60
#define WOODENBOX_API_PORT		5000

WiFiUDP udp;
WakeOnLan wol(udp);

WiFiClientSecure secure_client;
UniversalTelegramBot bot(TELEGRAM_TOKEN, secure_client);

const String woodenbox_pi_100M_mac =	"REDACTED";
const String woodenbox_pi_1G_mac =		"REDACTED";

String public_IPv4;

const uint32_t woodenbox_id = 	200;
const uint32_t vpn_id = 		201;
const uint32_t nas_id = 		202;

IPAddress *woodenbox, *nas, *vpn;

void wait_until_WiFi_connected() {
	int delays = 0;
	while ((WiFi.status() != WL_CONNECTED)) {
		delay(DELAY_MS);
		delays++;
		if (delays > CONNECTION_ATTEMPS_MAX) {
			ESP.restart();
		}
	}	
}

void update_public_IPv4() {

	HTTPClient http;
	http.begin("http://ipinfo.io/ip");

	int response_code = http.GET();
	if (response_code != 200) {
		public_IPv4 = "X.X.X.X";
	}
	else {
		public_IPv4 = http.getString();
	}

	http.end();	
}

String send_HTTP_to_woodenbox(String endpoint) {

	HTTPClient http;
	String response;

	http.begin("http://" + woodenbox->toString() + ":" + WOODENBOX_API_PORT + endpoint);
	
	int response_code = http.GET();
	if (response_code == 0) {
		response = "Woodenbox does not respond";
	}
	else {
		response = http.getString();
	}

	http.end();	
	return response;
}

void handle_new_messages(int messages) {
	
	if (messages == 0) {
		return;
	}

	for (int i = 0; i < messages; i++) {

		if (bot.messages[i].from_id != MY_USERID) {
			Serial.printf("\nReceived a command from an unexpected user");
			continue;
		}

		String text = bot.messages[i].text;

		if (text.startsWith("/wol")) {
			Serial.printf("\nReceived /wol command");
			
			if (text == "/wol") {
				wol.sendMagicPacket(woodenbox_pi_100M_mac);
				wol.sendMagicPacket(woodenbox_pi_1G_mac);
				bot.sendMessage(MY_USERID, "WakeOnLan packet sent to woodenbox", "");
			}
			#endif
		}

		else if (text == "/status") {
			Serial.printf("\nReceived /status command");
			
			String message = "";
			message += "*woodenbox* is ";
			message += (Ping.ping(*woodenbox)) ? "_up_" : "_down_";
			message += "\n*vpn* is ";
			message += (Ping.ping(*vpn)) ? "_up_" : "_down_";
			message += "\n*nas* is ";
			message += (Ping.ping(*nas)) ? "_up_" : "_down_";

			bot.sendMessage(MY_USERID, message, "MarkdownV2");
		}

		else if (text == "/ip") {
			Serial.printf("\nReceived /ip command");
        	update_public_IPv4();
			bot.sendMessage(MY_USERID, "Public IPv4: " + public_IPv4, "");
		}
		
		else if (text == "/suspend") {
			Serial.printf("\nReceived /suspend command");
			String response = send_HTTP_to_woodenbox("/suspend");
			bot.sendMessage(MY_USERID, response, "");
		}

		else if (text == "/poweroff") {
			Serial.printf("\nReceived /poweroff command");
			String response = send_HTTP_to_woodenbox("/poweroff");
			bot.sendMessage(MY_USERID, response, "");
		}

		else if (text == "/reboot") {
			Serial.printf("\nReceived /reboot command");
			String response = send_HTTP_to_woodenbox("/reboot");
			bot.sendMessage(MY_USERID, response, "");
		}

		else if (text.startsWith("/start")) {
			Serial.printf("\nReceived /start command");

			String response;
			const char *parameter = text.c_str() + 6; // strlen("/start") = 6

			if (*parameter == '\0' || *parameter != ' ') {
				response = send_HTTP_to_woodenbox("/start");	
			}
			else {
				response = send_HTTP_to_woodenbox("/start?id=" + String(parameter + 1));
			}
			
			bot.sendMessage(MY_USERID, response, "");
		}

		else if (text.startsWith("/stop")) {
			Serial.printf("\nReceived /stop command");

			String response;
			const char *parameter = text.c_str() + 5; // strlen("/stop") = 5

			if (*parameter == '\0' || *parameter != ' ') {
				response = send_HTTP_to_woodenbox("/stop");	
			}
			else {
				response = send_HTTP_to_woodenbox("/stop?id=" + String(parameter + 1));
			}
			
			bot.sendMessage(MY_USERID, response, "");
		}

  	}

}

void setup() {

	/* Useful for debugging purposes */
	delay(STARTUP_DELAY_MS);

	Serial.begin(SERIAL_BAUD_RATE);

	Serial.printf("\n\n /* BOARD RESET */ \n");
	
	Serial.printf("\nConnecting to " SSID "...");

	WiFi.mode(WIFI_STA);
	WiFi.setHostname(HOSTNAME);
	WiFi.begin(SSID, PASSWORD);
	wait_until_WiFi_connected();

	Serial.printf("OK\n");

    update_public_IPv4();

	/* Assuming that the gateway looks like "X.X.X.1" */
	uint32_t subnet = ntohl(WiFi.gatewayIP()) - 1;
	woodenbox =	new IPAddress(htonl(subnet + woodenbox_id));
	nas = 		new IPAddress(htonl(subnet + nas_id));
	vpn = 		new IPAddress(htonl(subnet + vpn_id));
	
	Serial.printf("\nPublic IPv4: \t%s", public_IPv4.c_str());
	Serial.printf("\nLocal IPv4: \t%s", WiFi.localIP().toString());

	Serial.printf("\n > gateway: \t%s", WiFi.gatewayIP().toString());
	Serial.printf("\n > woodenbox: \t%s", woodenbox->toString());
	Serial.printf("\n > vpn: \t%s", vpn->toString());
	Serial.printf("\n > nas: \t%s", nas->toString());
	Serial.printf("\n");

	wol.setRepeat(WOL_ATTEMPS_MAX, WOL_DELAY_MS);
	
	secure_client.setCACert(TELEGRAM_CERTIFICATE_ROOT);
	bot.longPoll = LONG_POLL_S;

	bot.sendMessage(MY_USERID, "*DEBUG*: _ESP32 has just connected_", "MarkdownV2");
}

void loop() {
	if ((WiFi.status() != WL_CONNECTED)) {
		WiFi.reconnect();
		wait_until_WiFi_connected();
		bot.sendMessage(MY_USERID, "*DEBUG*: _ESP32 succesfully reconnected_", "MarkdownV2");
	}

	int messages;
	do {
		Serial.printf("\nPolling messages...");
		messages = bot.getUpdates(bot.last_message_received + 1);
		handle_new_messages(messages);
	}
	while (messages != 0);
}
```
