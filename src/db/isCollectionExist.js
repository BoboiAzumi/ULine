const Connect = require("./connect");

async function isCollectionExist(collection){
    try{
        const Koneksi = await Connect();
        const listCollection = await Koneksi.DB.listCollections().toArray()
        const isExist = listCollection.some((collections) => collections.name === collection)

        if(isExist){
            Koneksi.Client.close()
            return true
        }
        else{
            await Koneksi.Client.close()
            return false
        }
    }
    catch(e){
        console.error("["+new Date()+"] Error IsCollectionExist")
        console.error(e)
        return false
    }
}

module.exports = isCollectionExist