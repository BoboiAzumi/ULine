const express = require("express")
const {routes} = require("./routes")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const App = express()
App.set("view engine", "ejs")
App.set("views", path.join(__dirname, "/views"))
App.use(express.static(path.join(__dirname,"public")))
App.use(express.json())
App.use(express.urlencoded({extended: true}))
App.use(cookieParser())
App.use(session({
    secret: "ID-1000099-0099886664324-2342342442",
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))

App.use("/", routes)

module.exports = App