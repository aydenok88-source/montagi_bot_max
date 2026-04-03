import asyncio
import os
import logging
from maxapi import Bot, Dispatcher
from maxapi.types import MessageCreated

# --- НАСТРОЙКИ (берутся из переменных окружения Bothost) ---
BOT_TOKEN = os.getenv("BOT_TOKEN")
TARGET_CHAT_ID = int(os.getenv("TARGET_CHAT_ID"))
# -----------------------------------------------------------

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

@dp.message_created()
async def forward_message(event: MessageCreated):
    message = event.message
    sender = message.sender

    if sender and sender.is_bot:
        return

    message_text = message.body.text if message.body and message.body.text else None
    sender_name = sender.first_name if sender else "Пользователь"

    if message_text:
        text_to_forward = f"📨 **Переслано от {sender_name}**:\n\n{message_text}"
        await bot.send_message(chat_id=TARGET_CHAT_ID, text=text_to_forward)
        logging.info(f"Сообщение от {sender_name} переслано в чат {TARGET_CHAT_ID}")

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    logging.info("Бот запущен и слушает сообщения...")
    asyncio.run(main())
