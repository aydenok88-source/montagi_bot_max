import { Bot } from '@maxhub/max-bot-api';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TARGET_CHAT_ID = parseInt(process.env.TARGET_CHAT_ID);

const bot = new Bot(BOT_TOKEN);

bot.command('start', async (ctx) => {
    await ctx.reply('✅ Бот работает! Я пересылаю сообщения.');
    console.log('Получена команда /start');
});

bot.on('message_created', async (ctx) => {
    const message = ctx.message;
    
    // Игнорируем сообщения от самого бота
    if (message.sender && message.sender.is_bot) {
        return;
    }
    
    const text = message.body?.text;
    const senderName = message.sender?.first_name || 'Пользователь';
    
    console.log(`Получено от ${senderName}: ${text || '[вложение]'}`);
    
    try {
        if (text) {
            await bot.api.sendMessageToChat(
                TARGET_CHAT_ID, 
                `📨 Переслано от ${senderName}:\n\n${text}`
            );
        }
        
        // Пересылка вложений (фото, видео, файлы)
        if (message.body?.attachments && message.body.attachments.length > 0) {
            for (const attachment of message.body.attachments) {
                await bot.api.sendMessageToChat(
                    TARGET_CHAT_ID,
                    `📎 Вложение от ${senderName}`,
                    { attachments: [attachment] }
                );
            }
        }
    } catch (error) {
        console.error('Ошибка при пересылке:', error);
    }
});

bot.start();
console.log('🚀 Бот запущен и слушает сообщения...');
