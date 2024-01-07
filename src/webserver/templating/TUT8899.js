const { customAlphabet } = require("nanoid");
const Connect = require("../../db/connect");
const isCollectionExist = require("../../db/isCollectionExist");

async function create(text, files, callback){
    try{
        const {Client, DB} = await Connect();
        if(!(await isCollectionExist("invitation"))){
           await DB.createCollection("invitation")
        }

        const collection = await DB.collection("invitation")

        const gambar_depan = files.filter((file) => file.fieldname === "gambar_depan")
        const gambar_utama = files.filter((file) => file.fieldname === "gambar_utama")
        const galeri = files.filter((file) => file.fieldname === "galeri")
        const musik = files.filter((file) => file.fieldname === "musik")
        const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 8)

        const insert = {
            uid: nanoid(),
            ...text,
            gambar_depan: gambar_depan,
            gambar_utama: gambar_utama,
            galeri: galeri,
            musik: musik
        }

        await collection.insertOne(insert)
        Client.close()

        callback()
    }
    catch(e){
        console.log("Error : TUT8899 template")
        console.log(e)
    }
}

module.exports = create