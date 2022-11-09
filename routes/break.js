var express = require('express');
var router = express.Router();
const passport = require('passport');
const async = require('async');
const {getClients} = require("./utilities/utility.db");

router.get('/', isLoggedIn,function(req, res, next) {
    let clients = {};
    async.series([
        function (callback){
            getClients(function (err,data){
                if(!err){
                    clients = data;
                }
                callback();
            })
        }
    ],function (){
        res.render('break', { title: 'Soccer City Cards',user:req.user,clients:clients});
    })

});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


module.exports = router;
