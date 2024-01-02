const { MongoClient } = require("mongodb")
require("dotenv").config()

const HOST = process.env.MONGODB_HOST
const PORT = process.env.MONGODB_PORT

/**
 * Connects to a MongoDB database and returns the client and database objects.
 *
 * @return {Object} An object containing the client and database objects.
 */

async function Connect(){
    try{
        const Client = new MongoClient(`mongodb://${HOST}:${PORT}`)
        await Client.connect()
    
        const DB = await Client.db("Undangan")
        return {
            Client, 
            DB
        }
    }
    catch{
        console.log("["+new Date()+"] MongoDB Connection Failed")
        return {
            Client: null,
            DB: null
        }
    }
}

module.exports = Connect