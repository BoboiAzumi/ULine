const express = require("express")
const { isLogin, sessionCheck, isNotLogin } = require("./isLogin")
const router = express.Router()
const fs = require("fs")
const isCollectionExist = require("../db/isCollectionExist")
const Connect = require("../db/connect")
const verification = require("./verification")
const getTemplate = require("../db/getTemplate")
const getUser = require("../db/getUser")
const findTemplate = require("../db/findTemplate")
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(!(file.mimetype == "audio/mpeg" || file.mimetype == "audio/wav" || file.mimetype == "audio/ogg")){
            cb(null, path.join(__dirname, "/public/uploads/img/"))
        }
        else{
            cb(null, path.join(__dirname, "/public/uploads/audio/"))
        }
        
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-"+file.originalname)
    }
})

const upload = multer({storage: storage})

router.post("/create/", upload.any(), async(req, res) => {
    const create = require("./templating/"+req.body.templating_name)

    create(req.body, req.files, () =>{
        res.send("Miaw")
    })
})

router.get("/:uid", async(req, res) => {
    const { uid } = req.params
    const { DB, Client } = await Connect()
    const collection = await DB.collection("invitation")

    const invitation = await collection.find({uid: uid}).toArray()

    Client.close()

    res.render("invitation/"+invitation[0].templating_name, {data: invitation})
})

router.get("/", sessionCheck,(req, res) => {
    if(req.isLogin){
        res.render("index.ejs", { login:true })
    }
    else{
        res.render("index.ejs", { login:false })
    }
})

router.get("/login/", isLogin, sessionCheck, (req, res) => {
    const code = req.query.code ? req.query.code : "0"
    res.render("login.ejs", { code:code, login:false })
})

router.post("/login/", isLogin, async (req, res) => {
    if(isCollectionExist("Users")){
        const Koneksi = await Connect()
        const DB = Koneksi.DB
        const Users = DB.collection("Users")
        const getUser = await Users.find({username: req.body.username, password: req.body.password}).toArray()

        if(getUser.length > 0){
            req.session.userid = getUser[0]._id
            res.redirect("/dashboard/")
        }
        else{
            res.redirect("/login/?code=1")
        }
    }
    else{
        res.redirect("/login/?code=1")
    }
})

router.get("/logout/", isNotLogin, (req, res) => {
    req.session.destroy()
    res.redirect("/login/")
})

router.get("/dashboard/", isNotLogin, async (req, res) => {
    data = await getUser(req.session.userid)
    data = {...data, mode:"dashboard"}
    res.render("dashboard", {data: data})
})

router.get("/create/", isNotLogin, async (req, res) => {
    const data = {
        template: await getTemplate(), 
        mode:"create"
    }
    res.render("create", {data: data})
})

router.get("/create/:templates", isNotLogin, async (req, res) => {
    const {templates} = req.params
    isTemplateAvailable = await findTemplate(templates)
    const data = {
        mode:"create", 
        templates:templates
    }
    if(isTemplateAvailable.length > 0){
        res.render("creating", {data:data})
    }
    else{
        res.redirect("/create/")
    }
})


router.get("/signup/", isLogin, (req, res) => {
    const code = req.query.code ? req.query.code : "0"
    res.render("signup.ejs", { code:code, login: false })
})

router.post("/signup/", isLogin, async (req, res) => {
    const Koneksi = await Connect()
    const DB = Koneksi.DB
    const Client = Koneksi.Client

    try{
        if(!(await isCollectionExist("Users"))){
            await DB.createCollection("Users")
        }
    
        const user = await DB.collection("Users").find({ username : req.body.username }).toArray()
        if(user.length === 0){
            await DB.collection("Users").insertOne({
                email: req.body.email,
                nama: req.body.nama,
                username: req.body.username,
                password: req.body.password,
                status: "unverified"
            })

            const code = await verification(req.body.username)

            await Client.close()
            res.redirect("/verification/?code="+code+"&username="+req.body.username)
        }
        else{
            await Client.close()
            if(user[0].status === "unverified"){
                const code = await verification(req.body.username)
                res.redirect("/verification/?code="+code+"&username="+req.body.username)
            }
            else{
                res.redirect("/signup/?code=1")
            }
        }
    }
    catch(e){
        console.log("["+new Date()+"] Server Error /signup/")
        console.log(e)
        res.send("Server Error")
    }
})

router.get("/verification/", isLogin, (req, res) => {
    const code = req.query.code
    const username = req.query.username
    res.render("verification.ejs", { login: true , code:code, username:username})
})

module.exports = {routes : router}