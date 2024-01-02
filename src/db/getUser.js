const { ObjectId } = require("mongodb");
const Connect = require("./connect");

async function getUser(userid){
    const {DB, Client} = await Connect()
    const Users = await DB.collection("Users")
    const User = await Users.find({_id: new ObjectId(userid)}).toArray()
    Client.close()
    return User[0]
}

module.exports = getUser