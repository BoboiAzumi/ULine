const { ObjectId } = require("mongodb");
const Connect = require("./connect");

async function getTemplate(){
    const {DB, Client} = await Connect()
    const Template = await DB.collection("Template")
    const ListTemplate = await Template.find().toArray()
    Client.close()
    return ListTemplate
}

module.exports = getTemplate