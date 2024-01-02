function isLogin(req, res, next){
    if(req.session.userid){
        res.redirect("/dashboard/")
    }
    else{
        next()
    }
}

function isNotLogin(req, res, next){
    if(req.session.userid === undefined){
        res.redirect("/login/")
    }
    else{
        next()
    }
}

function sessionCheck(req, res, next){
    if(req.session.userid){
        req.isLogin = true;
    }
    else{
        req.isLogin = false;
    }

    next()
}

module.exports = {
    isLogin,
    isNotLogin,
    sessionCheck
}