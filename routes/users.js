var express = require('express');
const md5 = require('md5');
const async = require('async');
const {deleteCard, getClientByEmail, addClient, getClients, addCard, getCards} = require("./utilities/utility.db");
var router = express.Router();

/* GET users listing. */
router.get('/', isLoggedIn,function(req, res, next) {
  let clients = {};
  let cards = {};
  async.series([
      function (callback){
        getClients(function (err,data){
          if(!err){
            clients = data;
          }
          callback();
        })
      },
    function (callback){
      let value = req.query.search || '';
      let client_id = req.query.client_id || '';
      getCards(value,client_id,req.user.id,function (err,resp){
        if(!err){
          cards = resp;
        }
        callback();
      })
    }
  ],function (){
    res.render('users', {
      user: req.user,
      clients: clients,
      cards: cards
    });
  })
});

router.get('/getClients',isLoggedIn,function (req,res,next){
  getClients(function (err,data){
    if(!err){
      res.send(data)
    }
  })
})


router.post('/editProfile',isLoggedIn,function (req,res,next){
  if(req.body.username && req.body.email){
    editProfile(req.body.username,req.user.id,req.body.email,function (err,resp){
      if(!err && resp){
        req.user.username = req.body.username;
        req.user.email = req.body.email;
        res.send(true)
      }
    })
  }
})

router.post('/addClient',isLoggedIn,function (req,res,next){
  if(req.body.name && req.body.email && req.body.surname){
    getClientByEmail(req.body.email,function (err,exists){
      if(!err && !exists){
        addClient(req.body.name, req.body.surname, req.body.email,function (err,data){
          if(!err && data){
            res.send(true)
          }
        })
      }
    })
  }
})

router.post('/addCard',isLoggedIn,function (req,res,next){
  if(req.body.value && req.body.card_name && req.body.player_name && req.body.printing && req.body.client_id && req.user.id){
    addCard(req.body.player_name,req.body.card_name,req.body.value,req.body.client_id,req.body.platform_id,req.body.printing, req.user.id,function (err,data){
      if(!err){
        res.send(true);
      }
    })
  }
})

router.get('/delete_card',isLoggedIn,function (req,res){
  if(req.query.id){
    deleteCard(req.query.id,function (err,result){
      res.redirect('/users');
    })
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
