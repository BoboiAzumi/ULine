const Telegram = require('node-telegram-bot-api');

class TelegramBot{
    constructor(TelegramKey){
        this.key = TelegramKey;
        this.telegram = null;
        this.init();
    }

    init(){
        this.telegram = new Telegram(this.key, {polling: true})

        this.telegram.on("polling_error", (err)=>{
            console.log(err)
        })
    }
}

module.exports = {
    TelegramBot
}