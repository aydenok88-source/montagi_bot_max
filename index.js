const { Bot } = require('@maxhub/max-bot-api');

const bot = new Bot(process.env.BOT_TOKEN);

// ========== СЮДА ВСТАВЬТЕ ВАШ ID ИЗ ШАГА 2 ==========
const TARGET_CHAT_ID = -72955283925194;  // ЗАМЕНИТЕ НА ВАШЕ ЧИСЛО
// ====================================================

// Функция для получения имени
function getName(sender) {
    if (!sender) return 'Неизвестный';
    if (sender.first_name) return sender.first_name;
    if (sender.username) return '@' + sender.username;
    return 'Пользователь';
}

bot.command('start', (ctx) => {
    ctx.reply('✅ Бот работает! Отправьте мне сообщение в личку.');
});

bot.on('message', async (ctx) => {
    // Пропускаем команды
    if (ctx.message.text && ctx.message.text.startsWith('/')) return;
    
    const senderName = getName(ctx.message.sender);
    const messageText = ctx.message.text || '';
    const forwardText = `📨 Отправитель: ${senderName}\n📝 Текст: ${messageText}`;
    
    try {
        await bot.api.sendMessageToChat(TARGET_CHAT_ID, forwardText);
        console.log(`✅ Переслано: ${forwardText}`);
    } catch (err) {
        console.log('❌ Ошибка:', err.message);
    }
});

bot.start();
console.log('🤖 Бот запущен. Напишите ему любое сообщение.');
