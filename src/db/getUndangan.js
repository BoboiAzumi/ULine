const { ObjectId } = require("mongodb");
const Connect = require("./connect");

async function getUndangan(userid){
    const {DB, Client} = await Connect()
    const Undangan = await DB.collection("Undangan")
    const ListUndangan = await Undangan.find({userid: new ObjectId(userid)}).toArray()
    Client.close()
    return ListUndangan
}

module.exports = getUndangan