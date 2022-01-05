const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const text = require('./const')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Незнакомец'}!`))
bot.help((ctx) => ctx.reply(text.commands))

bot.command('FAQ', async(ctx) => {
    try {
        await ctx.replyWithHTML('<b>Что выс интересует?</b>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('Что такое Etsy', 'btn_1'), Markup.button.callback('Где купить магазин', 'btn_2')],
                [Markup.button.callback('как это работает?', 'btn_3')],
                [Markup.button.callback('как это работает?', 'btn_4'), Markup.button.callback('hi', 'btn_5')]
            ]
        ))
    } catch (e) {
        console.error(e)
    }
})

function addActionBot(btn, src, text) {
    bot.action(btn, async(ctx) => {
        try {
            await ctx.answerCbQuery() // чтобы исчезали часики
            if (src !== false) {
                await ctx.replyWithPhoto({
                    source: src
                })
            }
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true // не показывать превью у сылок
            })
        } catch (e) {
            console.error(e)
        }
    })
}

addActionBot('btn_1', false, text.text.btn_1)
addActionBot('btn_2', false, text.text.btn_2)
addActionBot('btn_3', false, text.text.btn_3)


// Отслеживаем ключевые слова во всех сообщениях

bot.on('message', async ctx => {
    try {
        const msg = await ctx.message.text.toLowerCase()
        if (await msg.includes('hi')) {
            await ctx.reply('Привет здесь')
        }
        console.log(msg)
    } catch (e) {
        console.error(e)
    }
})

// сколько будет 2 + 2

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))