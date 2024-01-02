const { WebSocketServer } = require("ws")
const Connect = require("../db/connect")

async function TelegramSocket(TelegramService){
    const wss = new WebSocketServer({port: 1001})

    wss.on("connection", (ws) => {
        console.log("New Connection")
        console.log("Total Connected : "+wss.clients.size)
        ws.on("message", (data) => {
            const payload = JSON.parse(data.toString("utf-8"))
            if(payload.method = "verification"){
                ws.code = payload.code
                ws.username = payload.username
                ws.send(JSON.stringify({ status: "success" }))
                setTimeout(() => {
                    ws.send(JSON.stringify({ status: "waitting"}))
                }, 2000)
            }
        })

        ws.on("close", () => {
            console.log("Connection Closed")
            console.log("Total Connected : "+wss.clients.size)
        })
    })

    TelegramService.onText(/\/start/, async (message) => {
    try{
        const {DB, Client} = await Connect()
        const Verification = DB.collection("Verification")
        const Users = DB.collection("Users")
        const chatId = message.chat.id
        const code = message.text.split(" ")[1]

        const user = await Users.find({telegram: chatId}).toArray()
        const isDuplicateTelegram = user.length > 0 ? true : false

        if(isDuplicateTelegram){
            wss.clients.forEach(async (client) => {
                if(client.code === code){
                    TelegramService.send(chatId, "Akun telegram anda sudah terkait dengan akun ULine lain")
                    client.send(JSON.stringify({
                        status: "TelegramHasDuplicated"
                    }))
                }
                await Client.close()
            })
            return
        }
        
        const username = await Verification.find({verification: code}).toArray()
        if(username.length > 0){
            await Users.updateOne({username: username[0].username}, {$set:{telegram: chatId, status: "active"}})
            wss.clients.forEach(async (client) => {
                if(client.code === code && client.username === username[0].username){
                    client.send(JSON.stringify({
                        status: "OK"
                    }))
                    TelegramService.send(chatId, "Selamat, Verifikasi Berhasil")
                }
                await Verification.deleteOne({verification: code})
                await Client.close()
            })
        }
        else{
            wss.clients.forEach(async (client) => {
                if(client.code === code){
                    client.send(JSON.stringify({
                        status: "FAKE"
                    }))
                    TelegramService.send(chatId, "Terjadi kesalahan")
                }
                await Client.close()
            })
        }

        console.log(code)
    } catch (e){
        console.log("["+new Date()+"] Server Error Telegram_socket")
        console.log(e)
    }
    })

    console.log("Started Websocket Server")
}

module.exports = TelegramSocket