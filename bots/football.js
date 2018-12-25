const Telegraf = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN || '442331568:AAERSNBOgyK3700GpgPYhDrh9pMHhE3N2wY')

module.exports = {
  botStart: function() {
    console.log('123')
    bot.command('oldschool', (ctx) => ctx.reply('Hello'))
    bot.command('modern', ({ reply }) => reply('Yo'))
    bot.command('hipster', Telegraf.reply('λ'))
    bot.startPolling()
  }
}