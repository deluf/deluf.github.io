import os
import requests
from datetime import datetime
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes


BOT_TOKEN = "MY-VERY-SECURE-BOT-TOKEN"
MY_USERID = 0
FETCH_DELAY = 30


def log(message):
    print(str(datetime.now().time()) + " -> " + message)

async def suspend(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    log("Received /suspend command")
    await update.message.reply_text("Suspending...")
    os.system("sudo /usr/bin/systemctl suspend")

async def reboot(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    log("Received /reboot command")
    await update.message.reply_text("Rebooting...")
    os.system("sudo /usr/sbin/reboot")

async def poweroff(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    log("Received /poweroff command")
    await update.message.reply_text("Shutting down...")
    os.system("sudo /usr/sbin/poweroff")

async def startvpn(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    log("Received /startvpn command")
    await update.message.reply_text("Starting VPN container...")
    os.system("sudo /usr/sbin/pct start 202")

async def stopvpn(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    log("Received /stopvpn command")
    await update.message.reply_text("Stopping VPN container...")
    os.system("sudo /usr/sbin/pct shutdown 202")


# Sends a debug message every time the server boots
requests.post(
    url=f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
    data={
        "chat_id": MY_USERID,
        "text": "*DEBUG*: _woodenbox has just restarted_",
        "parse_mode": "MarkdownV2"
    }
)

app = ApplicationBuilder().token(BOT_TOKEN).build()
app.add_handler(CommandHandler("suspend", suspend))
app.add_handler(CommandHandler("reboot", reboot))
app.add_handler(CommandHandler("poweroff", poweroff))
app.add_handler(CommandHandler("startvpn", startvpn))
app.add_handler(CommandHandler("stopvpn", stopvpn))
app.run_polling(poll_interval=FETCH_DELAY)
