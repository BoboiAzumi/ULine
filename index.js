const { TelegramBot } = require("./src/telegram_handler")
const WebServer = require("./src/webserver")
const TelegramSocket = require("./src/telegram_socket")
require("dotenv").config()

const telegram = new TelegramBot(process.env.TELEGRAM)
TelegramSocket(telegram.telegram)
WebServer.listen(process.env.PORT, process.env.SERVER, () => console.log(`Server berjalan di port ${process.env.port}`))