const { ObjectId } = require("mongodb");
const Connect = require("./connect");

async function findTemplate(templateid){
    const {DB, Client} = await Connect()
    const Template = await DB.collection("Template")
    const ListTemplate = await Template.find({templateid: templateid}).toArray()
    Client.close()
    return ListTemplate
}

module.exports = findTemplate