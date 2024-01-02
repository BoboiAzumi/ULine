const { nanoid } = require("nanoid")
const Connect = require("../db/connect")
const isCollectionExist = require("../db/isCollectionExist")

async function verification(username){
    const code = nanoid(6).toUpperCase()
    const Koneksi = await Connect()
    const DB = Koneksi.DB
    const Client = Koneksi.Client

    if(!(await isCollectionExist("Verification"))){
        await DB.createCollection("Verification")
    }   

    const verification = await DB.collection("Verification").find({username: username}).toArray()

    if(verification.length > 0){
        DB.collection("Verification").deleteMany({username: username})
    }

    await DB.collection("Verification").insertOne({
        username: username,
        verification: code
    })

    await Client.close()

    return code;
}

module.exports = verification